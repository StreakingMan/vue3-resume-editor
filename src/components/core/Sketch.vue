<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import useMouseDragDynamic, { type MouseEvtInfo } from '@/composables/useMouseDragDynamic';
import { usePaper, useRuntime } from '@/composables/useApp';
import { useActiveElement, useDebounceFn, useMagicKeys, useWindowSize } from '@vueuse/core';
import { paperSizeMap } from '@/classes/Paper';
import useWindowMouseWheel from '@/composables/useWindowMouseWheel';
import { SCALE_RANGE } from '@/components/core/config';

const { height: windowHeight, width: windowWidth } = useWindowSize();

const runtime = useRuntime();
const wrapperRef = ref<HTMLDivElement | null>(null);

const grabbing = ref(false);

const scrolling = ref(false);
const setUnScrollingDebounce = useDebounceFn(() => {
    scrolling.value = false;
}, 300);
// 优化Mac触控板滚动（屏蔽默认行为，重新赋值两个轴的偏移量）
const handleSketchWheel = (e: WheelEvent) => {
    if (!wrapperRef.value || e.ctrlKey) return;
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

    // paper位置初始化
    runtime.scale.value = (window.innerHeight - 160) / paperSizeMap.a4.h;
    nextTick(() => {
        if (!wrapperRef.value) return;
        wrapperRef.value.scrollTo({
            top: windowHeight.value / 2,
            left: (wrapperRef.value.scrollWidth - windowWidth.value) / 2,
        });
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

// 以鼠标为中心进行缩放
// 计算依据：缩放前后，鼠标位置与页面的相对百分比位置不变
// const mousePaperPercentX = computed(() => {
//     return (runtime.scale.position.x - runtime.paper.bounds.x) / runtime.paper.bounds.width;
// });
// const mousePaperPercentY = computed(() => {
//     return (runtime.scale.position.y - runtime.paper.bounds.y) / runtime.paper.bounds.height;
// });
// watch(
//     () => ({
//         mppx: mousePaperPercentX.value,
//         mppy: mousePaperPercentY.value,
//         scale: runtime.scale.value,
//     }),
//     (newInfo, oldInfo) => {
//         // 单位偏移
//         const unitOffsetX = paperInstance.w * (newInfo.mppx - oldInfo.mppx);
//         const unitOffsetY = paperInstance.h * (newInfo.mppy - oldInfo.mppy);
//         // 真实偏移
//         const offsetX = unitOffsetX / newInfo.scale;
//         const offsetY = unitOffsetY / newInfo.scale;
//         // 补偿容器滚动
//         wrapperRef.value.scrollLeft -= offsetX;
//         wrapperRef.value.scrollTop -= offsetY;
//     },
// );
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
            runtime.scale.position.x = x;
            runtime.scale.position.y = y;
            runtime.scale.value += wheelDelta;
        }
    },
});

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
    <div
        ref="wrapperRef"
        class="sketch__wrapper"
        :style="[
            `--scroll-thumb-color: ${scrolling ? 'rgba(255,255,255,0.3)' : 'transparent'}`,
            { cursor },
        ]"
    >
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
            background-color: var(--scroll-thumb-color);
        }
    }

    &__inner {
        @media print {
            padding: 0 !important;
        }
    }
}
</style>
