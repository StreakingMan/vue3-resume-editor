<script lang="ts" setup>
import Paper from './Paper.vue';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import useMouseDrag, { MouseEvtInfo } from '@/composables/useMouseDrag';
import { useRuntime } from '@/composables/useApp';
import { useDebounceFn } from '@vueuse/core';
import { paperSizeMap } from '@/classes/Paper';

const runtime = useRuntime();
const wrapperRef = ref<HTMLDivElement | null>(null);
const paperRef = ref<InstanceType<typeof Paper> | null>(null);

const grabbing = ref(false);

const scrolling = ref(false);
const setUnScrollingDebounce = useDebounceFn(() => {
    scrolling.value = false;
}, 300);
// 优化Mac触控板滚动（屏蔽默认行为，重新赋值两个轴的偏移量）
const handleSketchWheel = (e: WheelEvent) => {
    if (!wrapperRef.value || !paperRef.value || e.ctrlKey) return;
    e.preventDefault();
    wrapperRef.value.scrollLeft += e.deltaX;
    wrapperRef.value.scrollTop += e.deltaY;
    scrolling.value = true;
    setTimeout(() => {
        setUnScrollingDebounce();
    }, 300);
};

onMounted(() => {
    if (!wrapperRef.value) return;

    // paper居中
    runtime.scale.value = (window.innerHeight - 120) / paperSizeMap.a4.h;
    wrapperRef.value.scrollLeft =
        (wrapperRef.value.children[0].clientWidth - window.innerWidth) / 2;
    wrapperRef.value.scrollTop =
        (wrapperRef.value.children[0].clientHeight - window.innerHeight) / 2;

    wrapperRef.value.addEventListener('wheel', handleSketchWheel);
});

onUnmounted(() => {
    wrapperRef.value?.removeEventListener('wheel', handleSketchWheel);
});

let scrollTopCache: number, scrollLeftCache: number;
useMouseDrag({
    onStart: () => {
        if (!runtime.keyboardStatus.space || !wrapperRef.value) return false;
        scrollLeftCache = wrapperRef.value.scrollLeft;
        scrollTopCache = wrapperRef.value.scrollTop;
    },
    onDrag: ({ transX, transY }: MouseEvtInfo) => {
        if (!wrapperRef.value) return false;
        wrapperRef.value.scrollLeft = scrollLeftCache - transX;
        wrapperRef.value.scrollTop = scrollTopCache - transY;
        grabbing.value = true;
    },
    onFinish: () => {
        grabbing.value = false;
    },
    bindElementRef: wrapperRef,
});

// 以鼠标为中心进行缩放
const firstFlag = ref(true);
watch(
    () => runtime.scale.value,
    async (newScale, oldScale) => {
        if (firstFlag.value) {
            firstFlag.value = false;
            return;
        }
        if (!wrapperRef.value) return;
        const { x, y } = runtime.scale.position;
        const { x: px, y: py, width: pw, height: ph } = runtime.paper.bounds;
        const offsetX = (px + pw / 2 - x) * (1 - oldScale / newScale);
        const offsetY = (py + ph / 2 - y) * (1 - oldScale / newScale);

        wrapperRef.value.scrollLeft -= offsetX;
        wrapperRef.value.scrollTop -= offsetY;
    },
);

// 光标样式
const cursor = computed(() => {
    if (runtime.keyboardStatus.space) {
        return grabbing.value ? 'grabbing' : 'grab';
    }
    if (runtime.keyboardStatus.ctrl) {
        return 'zoom-in';
    }
    return 'default';
});
</script>

<template>
    <div
        ref="wrapperRef"
        class="sketch__wrapper"
        :style="[
            `--scroll-thumb-color: ${
                scrolling ? 'rgba(255,255,255,0.3)' : 'transparent'
            }`,
            {
                cursor,
            },
        ]"
    >
        {{ scrolling }}
        <div class="sketch__inner">
            <Paper ref="paperRef" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.sketch {
    &__wrapper {
        position: fixed;
        width: 100%;
        height: 100%;
        overflow: scroll;
        top: 0;
        border-radius: 0;
        background-color: transparent;

        @media print {
            overflow: hidden !important;
        }

        &::-webkit-scrollbar,
        &::-webkit-scrollbar-corner {
            background-color: transparent;
            width: 12px;
            height: 12px;
        }
        &::-webkit-scrollbar-thumb {
            transition: background-color 0.3s;
            border-radius: 6px;
            background-color: var(--scroll-thumb-color);
        }
    }
    &__inner {
        position: absolute;
        padding: 80vh 80vw;
        @media print {
            padding: 0 !important;
        }
    }
}
</style>
