<template>
    <div
        id="paper"
        ref="paperRef"
        class="paper"
        :style="[
            (paper.cellSize < 10 || !showGrid) && 'background-image: none',
            {
                backgroundColor: paper.background,
                backgroundSize: `${paper.cellSize}px ${paper.cellSize}px,${paper.cellSize}px ${paper.cellSize}px`,
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
            <div
                v-if="selecting && !space"
                class="select-box"
                :style="selectorStyle"
            ></div>
        </v-theme-provider>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    ref,
    computed,
    watch,
    onMounted,
    toRef,
    Ref,
} from 'vue';
import useMouseDrag, { MouseEvtInfo } from '../../composables/useMouseDrag';
import MaterialInstance from './MaterialInstance.vue';
import { usePaper, useRuntime } from '../../composables/useApp';
import { Material } from '../../classes/Material';

export default defineComponent({
    name: 'Paper',
    components: { MaterialInstance },
    setup() {
        const runtime = useRuntime();
        const paper = usePaper();
        const paperRef = ref<HTMLDivElement | null>(null);

        onMounted(() => {
            // 初始化尺寸
            if (!paperRef.value) return;
            paperRef.value.style.width = paper.w + 'px';
            paperRef.value.style.height = paper.h + 'px';
        });

        // 缩放值监听设置
        watch(
            () => runtime.scale.value,
            async (v) => {
                if (!paperRef.value) return;
                paperRef.value.style.transform = `scale(${v})`;
            }
        );

        // 选择框拖拽
        const selectorX = ref(0);
        const selectorY = ref(0);
        const selectorW = ref(0);
        const selectorH = ref(0);
        const onSelectStart = (info: MouseEvtInfo) => {
            selectorW.value = 0;
            selectorH.value = 0;
            if (!paperRef.value) return false;
            if (runtime.keyboardStatus.space || runtime.keyboardStatus.ctrl)
                return false;
            const { startX, startY } = info;
            const { x, y } = paperRef.value.getBoundingClientRect();
            selectorX.value = (startX - x) / runtime.scale.value;
            selectorY.value = (startY - y) / runtime.scale.value;
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
        const { clicking: selecting } = useMouseDrag({
            onStart: onSelectStart,
            onDrag: onSelectDrag,
            onFinish: onSelectFinish,
            bindElementRef: paperRef,
            preventDefault: false,
        });

        // 选择框实时样式
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

        // TODO 分组边框
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

        return {
            space: toRef(runtime.keyboardStatus, 'space'),
            showGrid: toRef(runtime, 'showGrid'),
            groupRects,
            paperRef,
            paper,
            selecting,
            selectorStyle,
            materialList: toRef(paper, 'materialList') as Ref<Material<any>[]>,
        };
    },
});
</script>

<style lang="scss" scoped>
.paper {
    position: relative;
    border-radius: 4px;
    background-image: linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0),
        linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 0);
    background-position: initial;
    background-size: 10px 10px, 10px 10px;
    background-repeat: initial;
    background-attachment: initial;
    background-origin: initial;
    background-clip: initial;
    background-color: white;
    width: 620px;
    height: 877px;

    .select-box {
        position: absolute;
        background: lightblue;
        opacity: 0.3;
        z-index: 9;
    }

    .group-rect {
        position: absolute;
        background: lightcoral;
        opacity: 0.3;
        z-index: 1;
    }

    @media print {
        border-radius: 0;
    }
}
</style>
