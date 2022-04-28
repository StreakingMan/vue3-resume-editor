<template>
    <v-app>
        <v-app-bar app>
            <v-app-bar-nav-icon
                icon="mdi-widgets"
                @click.stop="drawer = !drawer"
            />
            <v-app-bar-title>
                <span class="font-weight-black">Vue3简历编辑器</span>
                <span class="text-subtitle-1 ml-2">轻松制作一份精美简历</span>
            </v-app-bar-title>
            <v-spacer />
            <Toolbar />
            <v-spacer />
            <v-btn icon>
                <v-icon>mdi-github</v-icon>
            </v-btn>
            <v-btn icon>
                <v-icon>mdi-printer</v-icon>
            </v-btn>
            <v-btn icon>
                <v-icon>mdi-content-save</v-icon>
            </v-btn>
            <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
        </v-app-bar>
        <v-navigation-drawer v-model="drawer" width="300" temporary app>
            <div class="w-100 h-100 d-flex flex-column">
                <MaterialPrototype class="flex-grow-0" />
                <div class="flex-grow-1 overflow-y-auto">
                    <!--                    something-->
                </div>
            </div>
        </v-navigation-drawer>
        <v-main class="bg-grey-darken-4">
            <Sketch ref="sketch" />
            <Beian />
        </v-main>
    </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, provide, reactive, Ref } from 'vue';
import { AppState } from './classes/App';
import useKeyboardStatus from './composables/useKeyboardStatus';
import useMouseWheel from './composables/useMouseWheel';
import { Paper } from './classes/Paper';
import Beian from './components/Beian.vue';
import Sketch from './components/core/Sketch.vue';
import MaterialPrototype from './components/core/MaterialPrototype.vue';
import Toolbar from './components/core/Toolbar.vue';

export default defineComponent({
    name: 'App',
    components: {
        Toolbar,
        MaterialPrototype,
        Sketch,
        Beian,
    },
    setup() {
        // 应用状态
        const appState: Ref<AppState> = ref('welcome');
        provide('app:state', appState);

        // 键盘状态
        const keyboardStatus = useKeyboardStatus();
        for (const [key, value] of Object.entries(keyboardStatus)) {
            provide(`keyboard:${key}`, value);
        }

        // 缩放值
        const scale = ref(1);
        const scalePosition = reactive({ x: 0, y: 0 });
        useMouseWheel({
            onWheel: (wheelDelta, { x, y }) => {
                const newScale = scale.value + wheelDelta;
                // 缩放范围0.1~5
                if (0.1 < newScale && newScale < 5) {
                    scale.value += wheelDelta;
                    scalePosition.x = x;
                    scalePosition.y = y;
                }
            },
        });
        provide('scale', scale);
        provide('scale:position', scalePosition);

        // Paper实例
        const paper = reactive(new Paper({ cellSize: 1 }));
        provide('paper', paper);

        // Sketch组件
        const sketch = ref(null);
        provide('sketch', sketch);

        // 当前操作
        const focusMaterial = ref(null);
        provide('focus:material', focusMaterial);

        return {
            ctrl: keyboardStatus.ctrl,
            space: keyboardStatus.space,
            sketch,
        };
    },
    data: () => ({
        drawer: true,
    }),
    methods: {},
});
</script>

<style lang="scss">
body {
    //
}
#app {
    //
}
.v-navigation-drawer__content {
    overflow: visible !important;
}
::-webkit-scrollbar {
    background-color: transparent;
    width: 8px;
}
::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
}
:focus-visible {
    outline: none;
}
</style>
