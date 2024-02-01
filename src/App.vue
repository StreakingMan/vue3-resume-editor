<script lang="ts" setup>
import { defineAsyncComponent, onMounted, toRefs, watch } from 'vue';
import { PaperMode } from './classes/Paper';
import Sketch from './components/core/Sketch.vue';
import sketch from './components/core/Sketch.vue';
import MaterialPrototype from './components/core/MaterialPrototype.vue';
import Toolbar from './components/tools/Toolbar.vue';
import { stringArrayDiff } from './utils/stringArrayDiff';
import template1 from './components/templates/resume-template-1.json';
import TemplateList from './components/templates/TemplateList.vue';
import { useMagicKeys, whenever } from '@vueuse/core';
import WebsiteInfo from '@/components/other/WebsiteInfo.vue';
import Paper from '@/components/core/Paper.vue';
import PreviewNavigator from '@/components/other/PreviewNavigator.vue';
import { createAndProvideReactiveRuntime } from '@/composables/useRuntime';
import { createAndProvideReactivePaper, usePaperMode } from '@/composables/usePaper';

// 运行时
const runtime = createAndProvideReactiveRuntime();
const { copyMaterialSet, activeMaterialSet } = toRefs(runtime);

// Paper实例
const paperInstance = createAndProvideReactivePaper();
onMounted(() => {
    // 尝试从localStorage加载数据
    if (!paperInstance.loadFromStorage()) {
        paperInstance.loadData(template1);
    }
});

// 复制粘贴
const { ctrl_c, ctrl_v } = useMagicKeys();
whenever(ctrl_c, () => {
    copyMaterialSet.value = new Set(activeMaterialSet.value);
});
whenever(ctrl_v, () => {
    paperInstance.copyMaterial([...copyMaterialSet.value]);
    copyMaterialSet.value.clear();
});

// 按del键删除
const { Delete } = useMagicKeys();
whenever(Delete, () => {
    paperInstance.removeMaterial([...activeMaterialSet.value]);
});

// ctrl+a全选
const { ctrl_a } = useMagicKeys();
whenever(ctrl_a, () => {
    for (const m of paperInstance.materialList) {
        activeMaterialSet.value.add(m.id);
    }
});

// 激活元素集合控制
watch(
    // 热知识：直接watch reactive对象的话，新旧值是一样的
    // 所以这里使用表达式
    () => [...activeMaterialSet.value],
    (nv, ov) => {
        if (!nv.length) {
            copyMaterialSet.value.clear();
        }

        // 激活列表增减时，同属分组元素一并操作
        const { added, removed } = stringArrayDiff(ov, nv);
        const needAddGroupIdSet = [
            ...new Set(added.map((mId) => paperInstance.queryMaterial(mId)?.groupId)),
        ];
        const needRemoveGroupIdSet = [
            ...new Set(removed.map((mId) => paperInstance.queryMaterial(mId)?.groupId)),
        ];
        needAddGroupIdSet.forEach((groupId) => {
            if (!groupId) return;
            paperInstance.queryGroupMaterials(groupId).forEach(({ id }) => {
                activeMaterialSet.value.add(id);
            });
        });
        needRemoveGroupIdSet.forEach((groupId) => {
            if (!groupId) return;
            paperInstance.queryGroupMaterials(groupId).forEach(({ id }) => {
                activeMaterialSet.value.delete(id);
            });
        });
    },
);

usePaperMode(PaperMode.Edit);

const DevPanel = defineAsyncComponent(() => import('./components/other/DevPanel.vue'));
const isDev = import.meta.env.DEV;
</script>

<template>
    <v-app>
        <v-app-bar flat border class="bg-grey-darken-3">
            <img src="/favicon.svg" alt="logo" class="h-100 py-2 pl-6" />

            <v-app-bar-title class="flex-grow-1">
                <span class="text-h4 font-weight-black brand-text font-italic">
                    Resume Editor
                </span>
                <span class="text-subtitle-1 ml-2">轻松制作精美简历</span>
            </v-app-bar-title>

            <Toolbar />
        </v-app-bar>
        <v-navigation-drawer v-model="runtime.bottomDrawer" temporary location="bottom">
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
            <MaterialPrototype />
            <v-divider />
            <v-btn
                class="toggle-left-drawer-btn print-none"
                :class="{ 'position-hide': !runtime.leftDrawer }"
                :icon="runtime.leftDrawer ? 'mdi-chevron-left' : 'mdi-chevron-right'"
                size="x-large"
                @click="runtime.leftDrawer = !runtime.leftDrawer"
            >
            </v-btn>
        </v-navigation-drawer>
        <v-main class="bg-grey-darken-3">
            <Sketch ref="sketch">
                <Paper />
            </Sketch>
            <PreviewNavigator />
            <WebsiteInfo />
            <v-defaults-provider
                :defaults="{
                    VBtn: {
                        class: 'position-fixed print-none',
                        icon: true,
                        size: 'x-large',
                    },
                }"
            >
                <v-btn
                    style="right: 24px; bottom: 128px"
                    color="#3f51b5"
                    href="https://github.com/StreakingMan/vue3-resume-editor#%E5%8A%9F%E8%83%BD%E6%BC%94%E7%A4%BA"
                    target="_blank"
                >
                    <v-icon>mdi-help</v-icon>
                    <v-tooltip activator="parent" anchor="start"> 使用文档 </v-tooltip>
                </v-btn>
                <v-btn
                    style="right: 24px; bottom: 48px"
                    color="#2196f3"
                    @click="runtime.bottomDrawer = !runtime.bottomDrawer"
                >
                    <v-icon>mdi-note-text-outline</v-icon>
                    <v-tooltip activator="parent" anchor="start"> 模板预设 </v-tooltip>
                </v-btn>
            </v-defaults-provider>
        </v-main>
        <v-snackbar
            v-model="runtime.snackbar.show"
            app
            top="72"
            right
            timeout="2000"
            color="grey-darken-3"
            transition="scroll-x-reverse-transition"
        >
            {{ runtime.snackbar.text }}
        </v-snackbar>
    </v-app>

    <DevPanel v-if="isDev" />
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

.brand-text {
    background-image: -webkit-linear-gradient(120deg, #5a42ec 30%, #09bbfe);
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 2px rgba(255, 255, 255, 0.2);
    animation: gradient 6s ease infinite;
    background-size: 400% 400%;
    background-position: 0 0;
}
@keyframes gradient {
    0% {
        background-position: 0 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0 50%;
    }
}

.toggle-left-drawer-btn {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateX(50%) translateY(-50%);
    transition: 0.3s;

    &.position-hide {
        transform: translateX(100px) translateY(-50%);
    }
}
</style>
