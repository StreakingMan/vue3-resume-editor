<template>
    <div ref="wrapper" class="sketch__wrapper" :class="`state-${appState}`">
        <div
            class="sketch__inner"
            :style="{
                padding: `${paddingY}px ${paddingX}px`,
            }"
        >
            <Paper v-if="appState === 'running'" ref="paper"></Paper>
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
    computed,
    watch,
    inject,
    Ref,
} from 'vue';
import { AppState } from '../../classes/App';
import useMouseDrag, { MouseEvtInfo } from '../../composables/useMouseDrag';
export default defineComponent({
    name: 'Sketch',
    components: { Paper },
    setup() {
        const wrapper = ref<HTMLDivElement>();
        let paperDiv = ref<HTMLDivElement>();
        const paper = ref(null);
        const paddingX = ref(0);
        const paddingY = ref(0);

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

        const appState: AppState = inject('appState');
        watch(appState, async (v) => {
            if (v === 'running') {
                await nextTick();
                paperDiv = ref<HTMLDivElement>(paper.value.paper);
                await adjustSketch();
            }
        });

        const space: Ref<boolean> = inject('keyboard:space');

        let scrollTopCache, scrollLeftCache;
        useMouseDrag({
            onStart: () => {
                if (!space.value) return false;
                scrollLeftCache = wrapper.value.scrollLeft;
                scrollTopCache = wrapper.value.scrollTop;
            },
            onDrag: ({ transX, transY }: MouseEvtInfo) => {
                wrapper.value.scrollLeft = scrollLeftCache - transX;
                wrapper.value.scrollTop = scrollTopCache - transY;
            },
            onFinish: () => {
                //
            },
            bindElementRef: wrapper,
        });

        const scale: Ref<number> = inject('scale');
        watch(scale, async () => {
            // 缩放后，调整边距
            const {
                innerWidth: windowWidth,
                innerHeight: windowHeight,
            } = window;
            // 这里实际上时paperInstance的w h
            const {
                clientWidth: paperInitWidth,
                clientHeight: paperInitHeight,
            } = paperDiv.value;
            const {
                width: paperWidth,
                height: paperHeight,
            } = paperDiv.value.getBoundingClientRect();

            paddingX.value = Math.floor(
                windowWidth * 0.8 + (paperWidth - paperInitWidth) / 2
            );
            paddingY.value = Math.floor(
                windowHeight * 0.8 + (paperHeight - paperInitHeight) / 2
            );
        });

        return {
            paddingX,
            paddingY,
            paper,
            wrapper,
            appState,
        };
    },
});
</script>

<style lang="scss" scoped>
@import 'src/styles/color';
@import 'src/styles/elevation';
@import 'src/styles/animate';

.sketch {
    &__wrapper {
        position: fixed;

        @include transition(500ms);

        &.state- {
            &welcome {
                @keyframes bgTrans {
                    0% {
                        background-color: #0288d1;
                    }
                    100% {
                        background-color: white;
                    }
                }

                width: 248px;
                height: 348px;
                top: 15vh;
                border-radius: 12px;
                animation: forwards 5s bgTrans ease;
                @include elevation(2);

                &:hover {
                    @include elevation(8);
                }
            }
            &running {
                width: 100vw;
                height: 100vh;
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
                    @include bgColor('primary-dark');
                }
            }
        }
    }
    &__inner {
        position: absolute;
    }
}
</style>
