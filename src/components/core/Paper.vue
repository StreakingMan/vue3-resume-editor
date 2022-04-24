<template>
    <div id="paper" ref="paper" class="paper" @click="onClick">
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
} from 'vue';

import useMouseDrag, { MouseEvtInfo } from '../../composables/useMouseDrag';
import MaterialInstance from './MaterialInstance.vue';
import { UnwrapNestedRefs } from '@vue/reactivity';
import { Paper } from '../../classes/Paper';

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
        const materialList = computed(() => paperInstance.materialList);
        onMounted(() => {
            if (!paper.value) return;
            paper.value.style.width = paperInstance.w + 'px';
            paper.value.style.height = paperInstance.h + 'px';
        });
        watch(paperInstance, (v) => {
            //console.log(v)
        });

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
        const onSelectFinish = (info: MouseEvtInfo) => {
            selectorW.value = 0;
            selectorH.value = 0;
        };
        const { clicking: selecting } = useMouseDrag({
            onStart: onSelectStart,
            onDrag: onSelectDrag,
            onFinish: onSelectFinish,
            bindElementRef: paper,
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

        const focusMaterial: Ref = inject('focus:material') as Ref;

        const onClick = () => {
            focusMaterial.value = null;
        };

        return {
            space,
            paper,
            selecting,
            selectorStyle,
            materialList,
            onClick,
        };
    },
});
</script>

<style lang="scss" scoped>
.paper {
    position: relative;
    background-color: white;
    border-radius: 4px;
    //

    .select-box {
        position: absolute;
        border: lightcoral;
        background: lightblue;
        opacity: 0.3;
        z-index: 9;
    }
}
</style>
