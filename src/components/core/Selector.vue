<template>
    <div
        v-if="selecting && !space"
        ref="selector"
        class="select-box"
        :style="selectorStyle"
    ></div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted, ref, Ref } from 'vue';
import useMouseDrag, { MouseEvtInfo } from '../../composables/useMouseDrag';

export default defineComponent({
    name: 'Selector',
    setup() {
        const space: Ref<boolean> = inject('keyboard:space');
        const paper = ref<HTMLDivElement>();
        const scale: Ref<number> = inject('scale');
        const selector = ref(null);

        onMounted(() => {
            console.log(selector);
        });

        const selectorX = ref(0);
        const selectorY = ref(0);
        const selectorW = ref(0);
        const selectorH = ref(0);
        const onSelectStart = (info: MouseEvtInfo) => {
            selectorW.value = 0;
            selectorH.value = 0;
            if (!paper.value) return false;
            if (space.value) return false;
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

        return {
            selector,
            space,
            selecting,
            selectorStyle,
        };
    },
});
</script>

<style lang="scss" scoped>
.select-box {
    position: absolute;
    border: lightcoral;
    background: lightblue;
    opacity: 0.3;
    z-index: 9;
}
</style>
