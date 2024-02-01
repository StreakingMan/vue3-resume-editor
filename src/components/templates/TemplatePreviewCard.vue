<script setup lang="ts">
import { computed, ref } from 'vue';
import { PaperMode } from '@/classes/Paper';
import Paper from '@/components/core/Paper.vue';
import { useRuntime } from '@/composables/useRuntime';
import { createAndProvideReactivePaper, usePaper, usePaperMode } from '@/composables/usePaper';

const props = defineProps<{
    template: any;
}>();

const matrix = ref<number[][]>([]);
const handleMouseMove = (e: MouseEvent) => {
    const { offsetX, offsetY, target } = e;
    const x = offsetX - (target as HTMLElement).offsetWidth / 2;
    const y = offsetY - (target as HTMLElement).offsetHeight / 2;
    matrix.value = [
        [1, 0, 0, x * 0.000005],
        [0, 1, 0, y * 0.000005],
        [0, 0, 1, 1],
        [0, 0, 0, 1],
    ];
};
const handleMouseLeave = () => {
    matrix.value = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
    ];
};

const transform = computed(() => {
    return `matrix3d(${matrix.value.toString()})`;
});

const paperInstance = createAndProvideReactivePaper({
    initData: props.template,
});

usePaperMode(PaperMode.Preview);

const runtime = useRuntime();
const realPaper = usePaper();

const onClick = () => {
    const res = window.confirm('模板将覆盖当前页面，确认使用？');
    if (res) {
        realPaper.loadData(props.template);
        runtime.bottomDrawer = false;
    }
};
</script>

<template>
    <div
        :style="{
            transform,
        }"
        class="template-preview--wrapper"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
    >
        <div class="template-preview--card" :style="{ backgroundColor: paperInstance.background }">
            <Paper />
        </div>
        <v-btn class="btn" color="primary" elevation="8" @click="onClick"> 使用模板 </v-btn>
    </div>
</template>

<style scoped lang="scss">
.btn {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    transition: 0.3s;
    opacity: 0;
}

.template-preview {
    &--card {
        width: 793px;
        height: 1122px;
        border: 1px solid white;
        border-radius: 4px;
        zoom: 0.18;
        position: relative;
        pointer-events: none;
        transition: 0.3s;
        overflow: hidden;
    }

    &--wrapper {
        position: relative;

        &:hover {
            .btn {
                opacity: 0.7;
            }

            .template-preview--card {
                transform: translateY(-100px);
            }
        }
    }
}
</style>
