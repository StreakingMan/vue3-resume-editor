<template>
    <Sketch ref="sketch"></Sketch>
    <Introduce></Introduce>
    <ShortcutTip></ShortcutTip>
    <MaterialPrototype></MaterialPrototype>
</template>

<script lang="ts">
import {
    defineComponent,
    ref,
    provide,
    reactive,
    inject,
    watch,
    Ref,
} from 'vue';
import Sketch from './components/core/Sketch.vue';
import Introduce from './components/guides/Introduce.vue';
import { AppState } from './classes/App';
import useKeyboardStatus from './composables/useKeyboardStatus';
import useMouseWheel from './composables/useMouseWheel';
import { Paper } from './classes/Paper';
import ShortcutTip from './components/guides/ShortcutTip.vue';
import MaterialPrototype from './components/core/MaterialPrototype.vue';

export default defineComponent({
    name: 'App',
    components: {
        MaterialPrototype,
        ShortcutTip,
        Introduce,
        Sketch,
    },
    setup() {
        // 应用状态
        const appState: Ref<AppState> = ref('welcome');
        provide('appState', appState);

        // 键盘状态
        const keyboardStatus = useKeyboardStatus();
        for (const [key, value] of Object.entries(keyboardStatus)) {
            provide(`keyboard:${key}`, value);
        }

        // 缩放值
        const scale = ref(1);
        useMouseWheel({
            onWheel: (wheelDelta) => {
                if (appState.value !== 'running') return;
                const newScale = scale.value + wheelDelta;
                // 缩放范围0.1~5
                if (0.1 < newScale && newScale < 5) {
                    scale.value += wheelDelta;
                }
            },
        });
        provide('scale', scale);

        // Paper实例
        const paper = reactive(new Paper({}));
        provide('paper', paper);

        // Sketch组件
        const sketch = ref(null);
        provide('sketch', sketch);

        return {
            ctrl: keyboardStatus.ctrl,
            space: keyboardStatus.space,
            sketch,
        };
    },
    methods: {},
});
</script>

<style lang="scss">
@import 'styles/color';
body {
    margin: 0;
    padding: 0;
    @include bgColor('primary');
}
#app {
    display: flex;
    justify-content: center;
    height: 100vh;
}
</style>
