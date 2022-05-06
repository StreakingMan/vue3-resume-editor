<template>
    <v-app>
        <v-app-bar app>
            <v-app-bar-nav-icon
                icon="mdi-widgets"
                @click.stop="leftDrawer = !leftDrawer"
            />
            <v-app-bar-title>
                <span class="font-weight-black">Vue3简历编辑器</span>
                <span class="text-subtitle-1 ml-2">轻松制作一份精美简历</span>
            </v-app-bar-title>
            <v-spacer />
            <Toolbar />
        </v-app-bar>
        <v-navigation-drawer
            v-model="bottomDrawer"
            temporary
            app
            position="bottom"
        >
            <TemplateList />
        </v-navigation-drawer>
        <v-navigation-drawer v-model="leftDrawer" width="300" temporary app>
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
            <v-btn
                class="position-fixed print-none"
                style="right: 24px; bottom: 128px"
                color="success"
                icon
                size="x-large"
                href="https://github.com/StreakingMan/vue3-resume-editor#%E5%8A%9F%E8%83%BD%E6%BC%94%E7%A4%BA"
                target="_blank"
            >
                <v-icon>mdi-help</v-icon>
                <v-tooltip activator="parent" anchor="start"
                    >使用文档</v-tooltip
                >
            </v-btn>
            <v-btn
                class="position-fixed print-none"
                style="right: 24px; bottom: 48px"
                color="primary"
                icon
                size="x-large"
                @click="bottomDrawer = !bottomDrawer"
            >
                <v-icon>mdi-file</v-icon>
                <v-tooltip activator="parent" anchor="start"
                    >模板预设</v-tooltip
                >
            </v-btn>
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
import {
    defineComponent,
    provide,
    reactive,
    onMounted,
    watch,
    toRef,
} from 'vue';
import useMouseWheel from './composables/useMouseWheel';
import { Paper, paperInjectionKey } from './classes/Paper';
import Beian from './components/Beian.vue';
import Sketch from './components/core/Sketch.vue';
import MaterialPrototype from './components/core/MaterialPrototype.vue';
import Toolbar from './components/tools/Toolbar.vue';
import { stringArrayDiff } from './utils/stringArrayDiff';
import { Runtime, runtimeInjectionKey } from './classes/Runtime';
import sketch from './components/core/Sketch.vue';
import template1 from './components/templates/resume-template-1.json';
import useKeyboardStatus from './composables/useKeyboardStatus';
import TemplateList from './components/templates/TemplateList.vue';

export default defineComponent({
    name: 'App',
    components: {
        TemplateList,
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
        const { space, ctrl, ctrlC, ctrlV, alt, shift } = useKeyboardStatus();
        watch(
            () => ({
                space: space.value,
                ctrl: ctrl.value,
                ctrlC: ctrlC.value,
                ctrlV: ctrlV.value,
                alt: alt.value,
                shift: shift.value,
            }),
            () => {
                runtime.keyboardStatus.space = space.value;
                runtime.keyboardStatus.ctrl = ctrl.value;
                runtime.keyboardStatus.ctrlC = ctrlC.value;
                runtime.keyboardStatus.ctrlV = ctrlV.value;
                runtime.keyboardStatus.alt = alt.value;
                runtime.keyboardStatus.shift = shift.value;
            }
        );

        // Paper实例
        const paper = reactive(new Paper({}));
        provide(paperInjectionKey, paper);
        onMounted(() => {
            if (!paper.loadFromStorage()) {
                paper.loadData(template1);
            }
            console.log(paper);
        });

        // 复制粘贴
        watch(
            () => ({
                ctrlC: runtime.keyboardStatus.ctrlC,
                ctrlV: runtime.keyboardStatus.ctrlV,
            }),
            ({ ctrlC, ctrlV }) => {
                if (ctrlC) {
                    runtime.copyMaterialSet = new Set(
                        runtime.activeMaterialSet
                    );
                }
                if (ctrlV) {
                    paper.copyMaterial([...runtime.copyMaterialSet]);
                    runtime.copyMaterialSet.clear();
                }
            }
        );

        // 激活元素集合控制
        watch(
            () => [...runtime.activeMaterialSet],
            (nv, ov) => {
                console.log('激活元素', nv, ov);
                if (!nv.length) {
                    runtime.copyMaterialSet.clear();
                }

                // 激活列表增减时，同属分组元素一并操作
                const { added, removed } = stringArrayDiff(ov, nv);
                const needAddGroupIdSet = [
                    ...new Set(
                        added.map((mId) => paper.queryMaterial(mId)?.groupId)
                    ),
                ];
                const needRemoveGroupIdSet = [
                    ...new Set(
                        removed.map((mId) => paper.queryMaterial(mId)?.groupId)
                    ),
                ];
                needAddGroupIdSet.forEach((groupId) => {
                    if (!groupId) return;
                    paper.queryGroupMaterials(groupId).forEach(({ id }) => {
                        runtime.activeMaterialSet.add(id);
                    });
                });
                needRemoveGroupIdSet.forEach((groupId) => {
                    if (!groupId) return;
                    paper.queryGroupMaterials(groupId).forEach(({ id }) => {
                        runtime.activeMaterialSet.delete(id);
                    });
                });
            }
        );

        return {
            snackbar: runtime.snackbar,
            leftDrawer: toRef(runtime, 'leftDrawer'),
            bottomDrawer: toRef(runtime, 'bottomDrawer'),
            sketch,
        };
    },
});
</script>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.print-none {
    @include printNone;
}
</style>

<style lang="scss">
body {
    &::-webkit-scrollbar {
        display: none;
    }

    -webkit-print-color-adjust: exact;
    color-adjust: exact;
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
    height: 8px;
}
::-webkit-scrollbar-thumb {
    background-color: rgba(128, 128, 128, 0.3);
    border-radius: 4px;
}
:focus-visible {
    outline: none;
}
</style>
