<template>
    <div
        ref="wrapper"
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
            <Paper ref="paper"></Paper>
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
} from 'vue';
import useMouseDrag, { MouseEvtInfo } from '../../composables/useMouseDrag';
import { UnwrapNestedRefs } from '@vue/reactivity';
export default defineComponent({
    name: 'Sketch',
    components: { Paper },
    setup() {
        const wrapper = ref<HTMLDivElement | null>(null);
        let paperDiv = ref<HTMLDivElement | null>(null);
        const paper = ref<InstanceType<typeof Paper> | null>(null);
        const paddingX = ref(0);
        const paddingY = ref(0);
        const grabbing = ref(false);

        // 调整Sketch 使paper居中
        const adjustSketch = async () => {
            if (!wrapper.value || !paperDiv.value) return;
            // 此时sketch铺满全屏，取屏幕大小计算边距
            const {
                innerWidth: windowWidth,
                innerHeight: windowHeight,
            } = window;
            paddingX.value = Math.floor(windowWidth * 0.8);
            paddingY.value = Math.floor(windowHeight * 0.8);

            // 更改padding值，视图更新后再调整scroll值
            // TODO 这里有时候走不下去，待查明
            await nextTick();
            const {
                width: paperWidth,
                height: paperHeight,
            } = paperDiv.value.getBoundingClientRect();
            wrapper.value.scrollLeft =
                (paperWidth + paddingX.value * 2 - windowWidth) / 2;
            wrapper.value.scrollTop =
                (paperHeight + paddingY.value * 2 - windowHeight) / 2;
        };

        window.addEventListener('resize', adjustSketch);
        onUnmounted(() => {
            window.removeEventListener('resize', adjustSketch);
        });

        onMounted(() => {
            if (!paper?.value?.paper) return;
            paperDiv = ref<HTMLDivElement>(paper.value.paper);
            adjustSketch();
        });

        const space: Ref<boolean> = inject('keyboard:space') as Ref<boolean>;
        const ctrl: Ref<boolean> = inject('keyboard:ctrl') as Ref<boolean>;
        let scrollTopCache: number, scrollLeftCache: number;
        useMouseDrag({
            onStart: () => {
                if (!space.value || !wrapper.value) return false;
                scrollLeftCache = wrapper.value.scrollLeft;
                scrollTopCache = wrapper.value.scrollTop;
            },
            onDrag: ({ transX, transY }: MouseEvtInfo) => {
                if (!wrapper.value) return false;
                wrapper.value.scrollLeft = scrollLeftCache - transX;
                wrapper.value.scrollTop = scrollTopCache - transY;
                grabbing.value = true;
            },
            onFinish: () => {
                grabbing.value = false;
            },
            bindElementRef: wrapper,
        });

        const scale: Ref<number> = inject('scale') as Ref<number>;
        const scalePosition: UnwrapNestedRefs<{
            x: number;
            y: number;
        }> = inject('scale:position') as UnwrapNestedRefs<{
            x: number;
            y: number;
        }>;
        watch(scale, async (newScale, oldScale) => {
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

            paddingX.value = Math.floor(
                windowWidth * 0.8 + (paperWidth - paperInitWidth) / 2
            );
            paddingY.value = Math.floor(
                windowHeight * 0.8 + (paperHeight - paperInitHeight) / 2
            );

            // 以鼠标为中心进行缩放
            if (wrapper.value) {
                const oldWidth = (paperWidth * oldScale) / newScale;
                const oldHeight = (paperHeight * oldScale) / newScale;
                const transWidth =
                    paperWidth * ((newScale - oldScale) / newScale);
                const transHeight =
                    paperHeight * ((newScale - oldScale) / newScale);
                const offsetX =
                    (transWidth * (scalePosition.x - paperX)) / oldWidth;
                const offsetY =
                    (transHeight * (scalePosition.y - paperY)) / oldHeight;
                wrapper.value.scrollLeft += offsetX;
                wrapper.value.scrollTop += offsetY;
            }
        });

        const cursor = computed(() => {
            if (space.value) {
                return grabbing.value ? 'grabbing' : 'grab';
            }
            if (ctrl.value) {
                return 'zoom-in';
            }
            return 'default';
        });

        return {
            paddingX,
            paddingY,
            paper,
            wrapper,
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
            //@include bgColor('primary-dark');
        }
    }
    &__inner {
        position: absolute;
    }
}
</style>
