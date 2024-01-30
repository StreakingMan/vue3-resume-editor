<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watchEffect } from 'vue';
import useMouseDragDynamic, { type MouseEvtInfo } from '@/composables/useMouseDragDynamic';
import { useActiveElement, useDebounceFn, useMagicKeys, useWindowSize } from '@vueuse/core';
import { paperSizeMap } from '@/classes/Paper';
import useWindowMouseWheel from '@/composables/useWindowMouseWheel';
import { SCALE_RANGE } from '@/components/core/config';
import { useRuntime } from '@/composables/useRuntime';
import { usePaper } from '@/composables/usePaper';

const { height: windowHeight, width: windowWidth } = useWindowSize();

const runtime = useRuntime();
const wrapperRef = ref<HTMLDivElement | null>(null);

const grabbing = ref(false);

// 优化Mac触控板滚动（屏蔽默认行为，重新赋值两个轴的偏移量）
const handleSketchWheel = (e: WheelEvent) => {
    if (!wrapperRef.value || e.ctrlKey) return;
    e.preventDefault();
    wrapperRef.value.scrollLeft += e.deltaX;
    wrapperRef.value.scrollTop += e.deltaY;
};

onMounted(() => {
    if (!wrapperRef.value) return;

    // paper位置初始化
    runtime.scale.value = (window.innerHeight - 160) / paperSizeMap.a4.h;
    nextTick(() => {
        const firstPageEl = document.getElementById('paper-page-1');
        if (firstPageEl) {
            firstPageEl.scrollIntoView({ block: 'center', inline: 'center' });
        }
    });

    wrapperRef.value.addEventListener('wheel', handleSketchWheel);
});

onUnmounted(() => {
    wrapperRef.value?.removeEventListener('wheel', handleSketchWheel);
});

const activeElement = useActiveElement();
const { space, ctrl } = useMagicKeys({
    passive: false,
    onEventFired(e) {
        // 屏蔽空格键滚动页面，或者目标为button时触发点击
        if (
            e.type === 'keydown' &&
            e.code === 'Space' &&
            (e.target === document.body || activeElement.value?.tagName === 'BUTTON')
        ) {
            e.preventDefault();
        }
    },
});

let scrollTopCache: number, scrollLeftCache: number;
useMouseDragDynamic({
    onStart: () => {
        if (!space.value || !wrapperRef.value) return false;
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

// 补偿缩放中心点的偏移
watchEffect(() => {
    if (!runtime.scale.cache.scaling) return;
    // 缩放中心起始点当前在屏幕的位置
    const lastCenterNowX =
        runtime.paper.bounds.x +
        runtime.scale.cache.mousePaperPercent.x * runtime.paper.bounds.width;
    const lastCenterNowY =
        runtime.paper.bounds.y +
        runtime.scale.cache.mousePaperPercent.y * runtime.paper.bounds.height;

    // 缩放中心点偏移量
    const offsetX = lastCenterNowX - runtime.scale.cache.mousePosition.x;
    const offsetY = lastCenterNowY - runtime.scale.cache.mousePosition.y;

    // 滚动
    wrapperRef.value?.scrollTo({
        left: runtime.scale.cache.containerScroll.left + offsetX,
        top: runtime.scale.cache.containerScroll.top + offsetY,
    });
});
// 监听鼠标滚轮事件
useWindowMouseWheel({
    onWheel: (wheelDelta, { x, y }, e) => {
        if (!e.ctrlKey) {
            return;
        }

        e.stopPropagation();
        e.preventDefault();

        // 更新缩放值
        const scaleValue = runtime.scale.value + wheelDelta;
        // 缩放范围0.1~5
        if (SCALE_RANGE[0] < scaleValue && scaleValue < SCALE_RANGE[1]) {
            runtime.scale.value += wheelDelta;
            if (!runtime.scale.cache.scaling) {
                runtime.scale.cache.scaling = true;
                // 记录开始时鼠标位置
                runtime.scale.cache.mousePosition.x = x;
                runtime.scale.cache.mousePosition.y = y;
                // 记录开始时鼠标相对于paper的百分比位置
                runtime.scale.cache.mousePaperPercent.x =
                    (x - runtime.paper.bounds.x) / runtime.paper.bounds.width;
                runtime.scale.cache.mousePaperPercent.y =
                    (y - runtime.paper.bounds.y) / runtime.paper.bounds.height;
                // 记录容器滚动条的位置
                runtime.scale.cache.containerScroll.left = wrapperRef.value?.scrollLeft || 0;
                runtime.scale.cache.containerScroll.top = wrapperRef.value?.scrollTop || 0;
            }
        }
        handleScrollStop();
    },
});
const handleScrollStop = useDebounceFn(() => {
    runtime.scale.cache.scaling = false;
}, 300);

// 光标样式
const cursor = computed(() => {
    if (space.value) {
        return grabbing.value ? 'grabbing' : 'grab';
    }
    if (ctrl.value) {
        return 'zoom-in';
    }
    return 'default';
});

// 出血框在页面缩放时保持不变
const paperInstance = usePaper();
const gapX = computed(() => {
    return windowWidth.value * 0.6 - Math.ceil((paperInstance.w * (1 - runtime.scale.value)) / 2);
});
const gapY = computed(() => {
    return (
        windowHeight.value * 0.6 -
        Math.ceil((paperInstance.h * paperInstance.pageCount * (1 - runtime.scale.value)) / 2)
    );
});
</script>

<template>
    <div ref="wrapperRef" class="sketch__wrapper" :style="{ cursor }">
        <div
            class="sketch__inner"
            :style="{
                margin: `${gapY}px ${gapX}px`,
                width: `${paperInstance.w}px`,
                transform: `scale(${runtime.scale.value})`,
            }"
        >
            <slot />
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
            background-color: #2a2a2a;
        }
    }

    &__inner {
        @media print {
            padding: 0 !important;
        }
    }
}
</style>
