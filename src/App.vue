<script lang="ts" setup>
import { computed, onMounted, provide, reactive, toRef, watch } from 'vue';
import useMouseWheel from './composables/useMouseWheel';
import { Paper, paperInjectionKey } from './classes/Paper';
import BeiAn from './components/BeiAn.vue';
import Sketch from './components/core/Sketch.vue';
import sketch from './components/core/Sketch.vue';
import MaterialPrototype from './components/core/MaterialPrototype.vue';
import Toolbar from './components/tools/Toolbar.vue';
import { stringArrayDiff } from './utils/stringArrayDiff';
import { Runtime, runtimeInjectionKey } from './classes/Runtime';
import template1 from './components/templates/resume-template-1.json';
import TemplateList from './components/templates/TemplateList.vue';
import { SCALE_RANGE } from '@/components/core/config';
import { useMagicKeys, whenever } from '@vueuse/core';

// 运行时
const runtime = reactive(new Runtime());
const leftDrawer = toRef(runtime, 'leftDrawer');
const bottomDrawer = toRef(runtime, 'bottomDrawer');
const snackbar = computed(() => runtime.snackbar);
provide(runtimeInjectionKey, runtime);
useMouseWheel({
    onWheel: (wheelDelta, { x, y }) => {
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
const { ctrl_c, ctrl_v } = useMagicKeys();
whenever(ctrl_c, () => {
    runtime.copyMaterialSet = new Set(runtime.activeMaterialSet);
});
whenever(ctrl_v, () => {
    paper.copyMaterial([...runtime.copyMaterialSet]);
    runtime.copyMaterialSet.clear();
});

// 按del键删除
const { Delete } = useMagicKeys();
whenever(Delete, () => {
    paper.removeMaterial([...runtime.activeMaterialSet]);
});

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
            ...new Set(added.map((mId) => paper.queryMaterial(mId)?.groupId)),
        ];
        const needRemoveGroupIdSet = [
            ...new Set(removed.map((mId) => paper.queryMaterial(mId)?.groupId)),
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
    },
);
</script>

<template>
    <v-app>
        <v-app-bar flat border class="bg-grey-darken-3">
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
        <v-navigation-drawer v-model="bottomDrawer" temporary location="bottom">
            <TemplateList />
        </v-navigation-drawer>
        <v-navigation-drawer
            v-model="runtime.leftDrawer"
            class="bg-grey-darken-3"
            width="300"
            temporary
            :elevation="0"
            :scrim="false"
        >
            <div class="w-100 h-100 d-fex flex-column">
                <MaterialPrototype class="flex-grow-0" />
                <div class="flex-grow-1 overflow-y-auto">
                    <!--                    something-->
                </div>
            </div>
        </v-navigation-drawer>
        <v-main class="bg-grey-darken-3">
            <Sketch ref="sketch" />
            <BeiAn />
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
                <v-tooltip activator="parent" anchor="start">
                    使用文档
                </v-tooltip>
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
                <v-tooltip activator="parent" anchor="start">
                    模板预设
                </v-tooltip>
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
