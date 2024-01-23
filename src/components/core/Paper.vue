<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import useMouseDragDynamic, { MouseEvtInfo } from '@/composables/useMouseDragDynamic';
import MaterialInstance from './MaterialInstance.vue';
import { usePaper, useRuntime } from '@/composables/useApp';
import { useElementBounding, useMagicKeys, useUrlSearchParams } from '@vueuse/core';

const runtime = useRuntime();
const paper = usePaper();
const paperRef = ref<HTMLDivElement | null>(null);

const { x, y, width, height } = useElementBounding(paperRef);
watch(
    () => ({
        x: x.value,
        y: y.value,
        width: width.value,
        height: height.value,
    }),
    () => {
        runtime.paper.bounds = {
            x: x.value,
            y: y.value,
            width: width.value,
            height: height.value,
        };
    },
);

// 选择框拖拽
const selectorX = ref(0);
const selectorY = ref(0);
const selectorW = ref(0);
const selectorH = ref(0);
const { current } = useMagicKeys();
const onSelectStart = (info: MouseEvtInfo) => {
    selectorW.value = 0;
    selectorH.value = 0;
    if (!paperRef.value) return false;
    if (current.size) return false;
    const { startX, startY } = info;
    selectorX.value = (startX - x.value) / runtime.scale.value;
    selectorY.value = (startY - y.value) / runtime.scale.value;
};
const onSelectDrag = (info: MouseEvtInfo) => {
    const { transX, transY } = info;
    selectorW.value = transX / runtime.scale.value;
    selectorH.value = transY / runtime.scale.value;
};
const onSelectFinish = (/*info: MouseEvtInfo*/) => {
    runtime.activeMaterialSet.clear();
    paper
        .getSelectRangeMaterial({
            x: selectorX.value,
            y: selectorY.value,
            w: selectorW.value,
            h: selectorH.value,
        })
        .forEach(({ id }) => {
            runtime.activeMaterialSet.add(id);
        });
    selectorW.value = 0;
    selectorH.value = 0;
};
const { clicking: selecting } = useMouseDragDynamic({
    onStart: onSelectStart,
    onDrag: onSelectDrag,
    onFinish: onSelectFinish,
    bindElementRef: paperRef,
    preventDefault: false,
});

// 选择框实时bounding样式
const selectorStyle = computed(() => {
    let left = selectorX.value,
        top = selectorY.value,
        width = selectorW.value,
        height = selectorH.value;
    if (width < 0) {
        width = -width;
        left = left - width;
    }
    if (height < 0) {
        height = -height;
        top = top - height;
    }
    return {
        left: left + 'px',
        top: top + 'px',
        width: width + 'px',
        height: height + 'px',
    };
});

const groupRects = computed<
    Array<{
        x: number;
        y: number;
        w: number;
        h: number;
    }>
>(() => {
    const groupIds = new Set<string>();
    for (const mId of runtime.activeMaterialSet) {
        const m = paper.queryMaterial(mId);
        if (m && m?.groupId) {
            groupIds.add(m.groupId);
        }
    }
    const rects = [];
    for (const groupId of groupIds) {
        const rect = paper.getGroupRect(groupId);
        if (rect) rects.push(rect);
    }
    return rects;
});

const showGrid = computed(() => runtime.showGrid);
const materialList = computed(() => paper.materialList);

const paperStyle = computed(() => [
    paper.cellSize < 10 || !showGrid.value ? 'background-image: none' : '',
    {
        width: paper.w + 'px',
        height: paper.h + 'px',
        backgroundColor: paper.background,
        backgroundSize: `${paper.cellSize}px ${paper.cellSize}px,${paper.cellSize}px ${paper.cellSize}px`,
    },
]);

const isPrintPage = !!useUrlSearchParams().printPage;

const deletePage = (index: number) => {
    paper.pageCount--;
    console.log('删除页', index);
    // TODO 判断是否有元素
    //  询问是否删除范围内的元素
    // 调整后面元素的位置
};
</script>

<template>
    <div
        id="paper"
        ref="paperRef"
        class="paper"
        :style="[
            ...paperStyle,
            {
                height: isPrintPage ? (paper.h + 1) * paper.pageCount + 'px ' : paper.h + 'px',
            },
        ]"
    >
        <v-theme-provider theme="light">
            <div
                v-for="(g, i) in groupRects"
                :key="i"
                class="group-rect"
                :style="{
                    left: g.x + 'px',
                    top: g.y + 'px',
                    width: g.w + 'px',
                    height: g.h + 'px',
                }"
            ></div>
            <MaterialInstance
                v-for="(m, i) in materialList"
                :key="m.id"
                v-model:item="materialList[i]"
            ></MaterialInstance>
            <div v-if="selecting && !current.size" class="select-box" :style="selectorStyle"></div>
        </v-theme-provider>
    </div>
    <!--分页 -->
    <template v-if="!isPrintPage">
        <div v-for="p in paper.pageCount - 1" :key="p" class="paper" :style="paperStyle">
            <div
                class="paper-options"
                :style="{
                    transform: `scale(${1 / runtime.scale.value})`,
                }"
            >
                <v-defaults-provider
                    :defaults="{
                        VBtn: {
                            icon: true,
                            size: 64,
                            color: 'transparent',
                            flat: true,
                        },
                        VIcon: {
                            color: 'white',
                            size: 42,
                        },
                    }"
                >
                    <v-btn :ripple="false">
                        <v-icon> mdi-keyboard-return </v-icon>
                    </v-btn>
                    <v-btn @click="deletePage(p)">
                        <v-icon color="red"> mdi-note-remove-outline </v-icon>
                    </v-btn>
                </v-defaults-provider>
            </div>
        </div>
    </template>
</template>

<style lang="scss" scoped>
.paper {
    position: relative;
    border-radius: 4px;
    background-image: linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0),
        linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 0);
    background-position: initial;
    background-size:
        10px 10px,
        10px 10px;
    background-repeat: initial;
    background-attachment: initial;
    background-origin: initial;
    background-clip: initial;
    background-color: white;
    width: 620px;
    height: 877px;

    .select-box {
        position: absolute;
        background: #09bbfe22;
        border: 1px solid #09bbfe;
        z-index: 9;
    }

    .group-rect {
        position: absolute;
        background: #5a42ec22;
        border: 1px dashed #5a42ec;
        z-index: 1;
    }

    @media print {
        border-radius: 0;
        background-image: none;
        overflow: hidden !important;
    }
}

.paper-options {
    position: absolute;
    right: -80px;
    top: -32px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    @media print {
        display: none;
    }
}
</style>
