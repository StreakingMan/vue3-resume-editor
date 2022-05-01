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
        <v-snackbar
            v-model="snackbar.show"
            app
            top="72"
            right
            timeout="2000"
            color="grey-darken-3"
            transition="scroll-x-reverse-transition"
        >
            {{ snackbar.text }}
        </v-snackbar>
    </v-app>
</template>

<script lang="ts">
import { defineComponent, provide, reactive, onMounted, watch } from 'vue';
import useMouseWheel from './composables/useMouseWheel';
import { Paper, paperInjectionKey } from './classes/Paper';
import Beian from './components/Beian.vue';
import Sketch from './components/core/Sketch.vue';
import MaterialPrototype from './components/core/MaterialPrototype.vue';
import Toolbar from './components/tools/Toolbar.vue';
import { stringArrayDiff } from './utils/stringArrayDiff';
import { Runtime, runtimeInjectionKey } from './classes/Runtime';
import sketch from './components/core/Sketch.vue';

export default defineComponent({
    name: 'App',
    components: {
        Toolbar,
        MaterialPrototype,
        Sketch,
        Beian,
    },
    setup() {
        // 运行时
        const runtime = reactive(new Runtime());
        provide(runtimeInjectionKey, runtime);
        useMouseWheel({
            onWheel: (wheelDelta, { x, y }) => {
                // 更新缩放值
                const scaleValue = runtime.scale.value + wheelDelta;
                // 缩放范围0.1~5
                if (0.1 < scaleValue && scaleValue < 5) {
                    runtime.scale.value += wheelDelta;
                    runtime.scale.position.x = x;
                    runtime.scale.position.y = y;
                }
            },
        });

        // Paper实例
        const paper = reactive(new Paper({}));
        provide(paperInjectionKey, paper);
        onMounted(() => {
            paper.loadFromStorage();
            console.log(paper);
        });

        // TODO 激活元素集合控制
        watch(runtime.activeMaterialSet, (nv, ov) => {
            // 激活列表增减时，同属分组元素一并操作
            const { added, removed } = stringArrayDiff([...nv], [...ov]);
            const needAddGroupIds = added
                    .map((mId) => paper.queryMaterial(mId)?.groupId)
                    .filter((groupId) => !!groupId),
                needRemoveGroupIds = removed
                    .map((mId) => paper.queryMaterial(mId)?.groupId)
                    .filter((groupId) => !!groupId);
            //
        });

        return {
            snackbar: runtime.snackbar,
            ctrl: runtime.keyboardStatus.ctrl,
            space: runtime.keyboardStatus.space,
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
    &::-webkit-scrollbar {
        display: none;
    }
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
