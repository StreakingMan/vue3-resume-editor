<template>
    <div
        ref="wrapperDiv"
        class="sketch__wrapper"
        :style="{
            cursor,
        }"
    >
        <div
            class="sketch__inner"
            :style="{
                padding: `${paddingY}px ${paddingX}px`,
            }"
        >
            <Paper ref="paperRef"></Paper>
        </div>
    </div>
</template>

<script lang="ts">
import Paper from './Paper.vue';
import {
    defineComponent,
    onUnmounted,
    ref,
    nextTick,
    watch,
    inject,
    Ref,
    onMounted,
    computed,
    toRef,
} from 'vue';
import useMouseDrag, { MouseEvtInfo } from '../../composables/useMouseDrag';
import { UnwrapNestedRefs } from '@vue/reactivity';
import { useRuntime } from '../../composables/useApp';
export default defineComponent({
    name: 'Sketch',
    components: { Paper },
    setup() {
        const runtime = useRuntime();
        const paperRef = ref<InstanceType<typeof Paper> | null>(null);
        let paperDiv = ref<HTMLDivElement | null>(null);

        const grabbing = ref(false);

        // 调整Sketch 使paper居中
        const adjustSketch = async () => {
            if (!runtime.sketch.wrapperDiv || !paperDiv.value) return;
            // 此时sketch铺满全屏，取屏幕大小计算边距
            const {
                innerWidth: windowWidth,
                innerHeight: windowHeight,
            } = window;
            runtime.sketch.paddingX = Math.floor(windowWidth * 0.8);
            runtime.sketch.paddingY = Math.floor(windowHeight * 0.8);

            // 更改padding值，视图更新后再调整scroll值
            // TODO 这里有时候走不下去，待查明
            await nextTick();
            const {
                width: paperWidth,
                height: paperHeight,
            } = paperDiv.value.getBoundingClientRect();
            runtime.sketch.wrapperDiv.scrollLeft =
                (paperWidth + runtime.sketch.paddingX * 2 - windowWidth) / 2;
            runtime.sketch.wrapperDiv.scrollTop =
                (paperHeight + runtime.sketch.paddingY * 2 - windowHeight) / 2;
        };

        onMounted(() => {
            if (!paperRef?.value?.paperRef) return;
            paperDiv = ref<HTMLDivElement>(paperRef.value.paperRef);
            adjustSketch();
            window.addEventListener('resize', adjustSketch);
        });

        onUnmounted(() => {
            window.removeEventListener('resize', adjustSketch);
        });

        let scrollTopCache: number, scrollLeftCache: number;
        useMouseDrag({
            onStart: () => {
                if (!runtime.keyboardStatus.space || !runtime.sketch.wrapperDiv)
                    return false;
                scrollLeftCache = runtime.sketch.wrapperDiv.scrollLeft;
                scrollTopCache = runtime.sketch.wrapperDiv.scrollTop;
            },
            onDrag: ({ transX, transY }: MouseEvtInfo) => {
                if (!runtime.sketch.wrapperDiv) return false;
                runtime.sketch.wrapperDiv.scrollLeft = scrollLeftCache - transX;
                runtime.sketch.wrapperDiv.scrollTop = scrollTopCache - transY;
                grabbing.value = true;
            },
            onFinish: () => {
                grabbing.value = false;
            },
            bindElementRef: toRef(runtime.sketch, 'wrapperDiv'),
        });

        watch(
            () => runtime.scale.value,
            async (newScale, oldScale) => {
                // 缩放后，调整边距
                const {
                    innerWidth: windowWidth,
                    innerHeight: windowHeight,
                } = window;
                // 这里实际上时paperInstance的w h
                const {
                    clientWidth: paperInitWidth,
                    clientHeight: paperInitHeight,
                } = paperDiv.value as HTMLDivElement;
                const {
                    width: paperWidth,
                    height: paperHeight,
                    x: paperX,
                    y: paperY,
                } = (paperDiv.value as HTMLDivElement).getBoundingClientRect();

                runtime.sketch.paddingX = Math.floor(
                    windowWidth * 0.8 + (paperWidth - paperInitWidth) / 2
                );
                runtime.sketch.paddingY = Math.floor(
                    windowHeight * 0.8 + (paperHeight - paperInitHeight) / 2
                );

                // 以鼠标为中心进行缩放
                if (runtime.sketch.wrapperDiv) {
                    const oldWidth = (paperWidth * oldScale) / newScale;
                    const oldHeight = (paperHeight * oldScale) / newScale;
                    const transWidth =
                        paperWidth * ((newScale - oldScale) / newScale);
                    const transHeight =
                        paperHeight * ((newScale - oldScale) / newScale);
                    const offsetX =
                        (transWidth * (runtime.scale.position.x - paperX)) /
                        oldWidth;
                    const offsetY =
                        (transHeight * (runtime.scale.position.y - paperY)) /
                        oldHeight;
                    runtime.sketch.wrapperDiv.scrollLeft += offsetX;
                    runtime.sketch.wrapperDiv.scrollTop += offsetY;
                }
            }
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

        return {
            wrapperDiv: toRef(runtime.sketch, 'wrapperDiv'),
            paddingX: toRef(runtime.sketch, 'paddingX'),
            paddingY: toRef(runtime.sketch, 'paddingY'),
            paperRef,
            cursor,
        };
    },
});
</script>

<style lang="scss" scoped>
.sketch {
    &__wrapper {
        position: fixed;
        width: 100%;
        height: 100%;
        overflow: overlay;
        top: 0;
        border-radius: 0;
        background-color: transparent;

        &::-webkit-scrollbar,
        &::-webkit-scrollbar-corner {
            background-color: transparent;
            width: 12px;
            height: 12px;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 6px;
            background-color: transparent;
        }
    }
    &__inner {
        position: absolute;
    }
}
</style>
