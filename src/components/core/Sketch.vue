<template>
    <div ref="wrapperDiv" class="sketch__wrapper">
        <div
            class="sketch__inner"
            :style="{
                padding: `${paddingY}px ${paddingX}px`,
            }"
        >
            <Paper ref="paper"></Paper>
        </div>
    </div>
</template>

<script lang="ts">
import Paper from './Paper.vue';
import {
    defineComponent,
    onMounted,
    onUnmounted,
    ref,
    nextTick,
    inject,
} from 'vue';
export default defineComponent({
    name: 'Sketch',
    components: { Paper },
    setup() {
        const wrapperDiv = ref<HTMLDivElement>();
        let paperDiv = ref<HTMLDivElement>();
        const paper = ref(null);
        const paddingX = ref(0);
        const paddingY = ref(0);

        const adjustSketch = async () => {
            if (!wrapperDiv.value || !paperDiv.value) return;
            const {
                width: wrapperWidth,
                height: wrapperHeight,
            } = wrapperDiv.value.getBoundingClientRect();
            const {
                width: paperWidth,
                height: paperHeight,
            } = paperDiv.value.getBoundingClientRect();
            paddingX.value = Math.floor(wrapperWidth * 0.8);
            paddingY.value = Math.floor(wrapperHeight * 0.8);
            // 更改padding值，视图更新后再调整scroll值
            await nextTick();
            wrapperDiv.value.scrollLeft =
                (paperWidth + paddingX.value * 2 - wrapperWidth) / 2;
            wrapperDiv.value.scrollTop =
                (paperHeight + paddingY.value * 2 - wrapperHeight) / 2;
        };

        window.addEventListener('resize', adjustSketch);

        onMounted(() => {
            paperDiv = ref<HTMLDivElement>(paper.value.paper);

            adjustSketch();
        });

        onUnmounted(() => {
            window.removeEventListener('resize', adjustSketch);
        });

        return {
            paddingX,
            paddingY,
            wrapperDiv,
            paper,
        };
    },
});
</script>

<style lang="scss" scoped>
.sketch {
    &__wrapper {
        width: 100%;
        height: 100%;
        overflow: scroll;
        position: relative;
    }
    &__inner {
        position: absolute;
    }
}
</style>
