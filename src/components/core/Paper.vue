<template>
    <div
        id="paper"
        ref="paper"
        class="paper"
        :style="[
            (paperInstance.cellSize < 10 || !showGrid) &&
                'background-image: none',
            {
                backgroundColor: paperInstance.background,
                backgroundSize: `${paperInstance.cellSize}px ${paperInstance.cellSize}px,${paperInstance.cellSize}px ${paperInstance.cellSize}px`,
            },
        ]"
    >
        <v-theme-provider theme="light">
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
    inject,
    ref,
    computed,
    Ref,
    watch,
    onMounted,
    toRefs,
} from 'vue';

import useMouseDrag, { MouseEvtInfo } from '../../composables/useMouseDrag';
import MaterialInstance from './MaterialInstance.vue';
import { UnwrapNestedRefs } from '@vue/reactivity';
import { Paper } from '../../classes/Paper';
import { Material } from '../../classes/Material';

export default defineComponent({
    name: 'Paper',
    components: { MaterialInstance },
    setup() {
        // 按键状态注入
        const space: Ref<boolean> = inject('keyboard:space') as Ref<boolean>;
        const ctrl: Ref<boolean> = inject('keyboard:ctrl') as Ref<boolean>;
        const paper = ref<HTMLDivElement>();

        // Paper实例注入
        const paperInstance: UnwrapNestedRefs<Paper> = inject(
            'paper'
        ) as UnwrapNestedRefs<Paper>;
        const { materialList } = toRefs(paperInstance);
        onMounted(() => {
            if (!paper.value) return;
            paper.value.style.width = paperInstance.w + 'px';
            paper.value.style.height = paperInstance.h + 'px';
        });
        watch(
            () => materialList.value.length,
            (v) => {
                //console.log(v);
            }
        );

        // 选中元素注入
        const focusMaterialList = inject('focus:materialList') as Ref<
            Material<any>['id'][]
        >;

        // 缩放值注入
        const scale = inject('scale') as Ref<number>;

        watch(scale, async (v) => {
            if (!paper.value) return;
            paper.value.style.transform = `scale(${v})`;
        });
        // 选择框
        const selectorX = ref(0);
        const selectorY = ref(0);
        const selectorW = ref(0);
        const selectorH = ref(0);
        const onSelectStart = (info: MouseEvtInfo) => {
            selectorW.value = 0;
            selectorH.value = 0;
            if (!paper.value) return false;
            if (space.value || ctrl.value) return false;
            const { startX, startY } = info;
            const { x, y } = paper.value.getBoundingClientRect();
            selectorX.value = (startX - x) / scale.value;
            selectorY.value = (startY - y) / scale.value;
        };
        const onSelectDrag = (info: MouseEvtInfo) => {
            const { transX, transY } = info;
            selectorW.value = transX / scale.value;
            selectorH.value = transY / scale.value;
        };
        const onSelectFinish = (/*info: MouseEvtInfo*/) => {
            focusMaterialList.value = paperInstance
                .getSelectRangeMaterial({
                    x: selectorX.value,
                    y: selectorY.value,
                    w: selectorW.value,
                    h: selectorH.value,
                })
                .map((m) => m.id);
            selectorW.value = 0;
            selectorH.value = 0;
        };
        const { clicking: selecting } = useMouseDrag({
            onStart: onSelectStart,
            onDrag: onSelectDrag,
            onFinish: onSelectFinish,
            bindElementRef: paper,
            preventDefault: false,
        });

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

        const showGrid = inject('showGrid');

        return {
            space,
            paper,
            paperInstance,
            showGrid,
            selecting,
            selectorStyle,
            materialList,
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
        border: lightcoral;
        background: lightblue;
        opacity: 0.3;
        z-index: 9;
    }
}
</style>
