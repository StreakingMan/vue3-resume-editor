<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue';
import useMouseDragDynamic, { type MouseEvtInfo } from '@/composables/useMouseDragDynamic';
import MaterialInstance from './MaterialInstance.vue';
import { useElementBounding, useMagicKeys, useUrlSearchParams } from '@vueuse/core';
import type { Material } from '@/classes/Material';
import { vElementHover } from '@vueuse/components';
import { PaperMode } from '@/classes/Paper';
import AddPageBtn from '@/components/other/AddPageBtn.vue';
import { useRuntime } from '@/composables/useRuntime';
import { usePaper, usePaperMode } from '@/composables/usePaper';

const runtime = useRuntime();
const paper = usePaper();
const paperRef = ref<HTMLDivElement | null>(null);

const isEdit = usePaperMode() === PaperMode.Edit;

// paper bounding 信息实时更新
const { x, y, width, height } = useElementBounding(paperRef);
watch(
    () => ({
        x: x.value,
        y: y.value,
        width: width.value,
        height: height.value,
    }),
    () => {
        if (!isEdit) return;
        runtime.paper.bounds = {
            x: Math.ceil(x.value),
            y: Math.ceil(y.value),
            width: Math.ceil(width.value),
            height: Math.ceil(height.value) * paper.pageCount,
        };
    },
);
// 缩放的时候不知道为啥宽高没有根据，主动根据缩放值计算下
watch(
    () => runtime.scale.value,
    (v) => {
        if (!isEdit) return;
        runtime.paper.bounds.width = Math.ceil(paper.w * v);
        runtime.paper.bounds.height = Math.ceil(paper.h * v) * paper.pageCount;
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
    enable: isEdit,
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
    paper.cellSize < 10 || !showGrid.value || !isEdit ? 'background-image: none' : '',
    {
        width: paper.w + 'px',
        height: paper.h + 'px',
        backgroundColor: paper.background,
        backgroundSize: `${paper.cellSize}px ${paper.cellSize}px,${paper.cellSize}px ${paper.cellSize}px`,
    },
]);

const isPrintPage = !!useUrlSearchParams().printPage;

// 插入、删除的hover状态
const deleteConfirmMenus = ref<boolean[]>([]);
const pageOptionHover = ref<
    {
        insert: boolean;
        delete: boolean;
    }[]
>([]);
watchEffect(() => {
    if (!isEdit) return;
    deleteConfirmMenus.value = Array(paper.pageCount).fill(false);
    pageOptionHover.value = Array(paper.pageCount)
        .fill(0)
        .map(() => ({
            insert: false,
            delete: false,
        }));
});
const onHover = (state: boolean, type: 'insert' | 'delete', index: number) => {
    if (type === 'delete') {
        runtime.paper.hoveringDeletePageNum = state ? index + 1 : null;
    }
    pageOptionHover.value[index][type] = state;
};

// 增减页面
const tryDeletePage = (index: number) => {
    deleteConfirmMenus.value[index] = paper.hasMaterialInPage(index + 1);
    if (!deleteConfirmMenus.value[index]) {
        paper.deletePage(index + 1);
    }
};
const deletePage = (index: number) => {
    paper.deletePage(index + 1);
};
const insertPage = (index: number) => {
    paper.insertPage(index + 1);
};
</script>

<template>
    <div
        :id="isEdit ? 'paper-page-1' : ''"
        ref="paperRef"
        class="paper"
        :style="[
            ...paperStyle,
            {
                pointerEvents: isEdit ? 'auto' : 'none',
                height: isPrintPage ? (paper.h + 1) * paper.pageCount + 'px ' : paper.h + 'px',
            },
        ]"
    >
        <v-theme-provider theme="light">
            <template v-if="isEdit">
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
            </template>
            <MaterialInstance
                v-for="(m, i) in materialList"
                :key="m.id"
                v-model:item="(materialList as Material<any>[])[i]"
            ></MaterialInstance>
            <div v-if="selecting && !current.size" class="select-box" :style="selectorStyle"></div>
        </v-theme-provider>
    </div>
    <!--分页 -->
    <template v-if="!isPrintPage && isEdit">
        <div
            v-for="pageIdx in paper.pageCount - 1"
            :id="isEdit ? `paper-page-${pageIdx + 1}` : ''"
            :key="pageIdx"
            class="paper addon"
            :style="paperStyle"
            :class="{
                'danger-shadow': pageOptionHover[pageIdx].delete,
            }"
        >
            <div
                v-if="isEdit"
                class="page-divide-tip"
                :class="{
                    show: pageOptionHover[pageIdx].insert,
                }"
            ></div>
            <div
                v-if="isEdit"
                class="page-options"
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
                    <v-btn
                        v-element-hover="(state) => onHover(state, 'insert', pageIdx)"
                        @click="insertPage(pageIdx)"
                    >
                        <v-icon> mdi-keyboard-return </v-icon>
                    </v-btn>
                    <v-menu v-model="deleteConfirmMenus[pageIdx]" location="bottom">
                        <template #activator="{ props }">
                            <v-btn
                                v-element-hover="(state) => onHover(state, 'delete', pageIdx)"
                                v-bind="props"
                                @click="tryDeletePage(pageIdx)"
                            >
                                <v-icon color="red"> mdi-note-remove-outline </v-icon>
                            </v-btn>
                        </template>
                        <v-sheet class="pa-4 rounded print-none" width="200">
                            <div class="text-subtitle-2">
                                <v-icon color="red" size="small">mdi-alert</v-icon>
                                将删除的页面包含元素，确认删除？
                            </div>
                            <div class="d-flex ga-1">
                                <v-spacer />
                                <v-btn variant="text" @click="deleteConfirmMenus[pageIdx] = false">
                                    取消
                                </v-btn>
                                <v-btn variant="tonal" color="red" @click="deletePage(pageIdx)">
                                    确认
                                </v-btn>
                            </div>
                        </v-sheet>
                    </v-menu>
                </v-defaults-provider>
            </div>

            <AddPageBtn v-if="isEdit && pageIdx === paper.pageCount - 1" />
        </div>
    </template>

    <AddPageBtn v-if="!isPrintPage" />
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

    &.addon {
        transition: box-shadow 0.3s;
    }

    &.danger-shadow {
        box-shadow: 0 0 0 4px #f44336;
    }
}

.page-options {
    position: absolute;
    right: -80px;
    top: -32px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transform-origin: left 32px;

    @media print {
        display: none;
    }
}

.page-divide-tip {
    background: #424242;
    width: calc(100% + 32px);
    height: 1px;
    transition:
        height 0.1s,
        opacity 0.3s,
        clip-path 0.6s ease-out;
    user-select: none;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateY(-50%) translateX(-50%);
    z-index: 0;
    clip-path: polygon(0% 50%, 100% 0%, 100% 100%, 0% 50%);

    &.show {
        clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
        height: 36px;
    }

    @media print {
        display: none;
    }
}
</style>
