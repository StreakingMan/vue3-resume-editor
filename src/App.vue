<script lang="ts" setup>
import { computed, onMounted, provide, reactive, toRef, watch } from 'vue';
import useMouseWheel from './composables/useMouseWheel';
import { Paper as PaperClass, paperInjectionKey } from './classes/Paper';
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
import WebsiteInfo from '@/components/other/WebsiteInfo.vue';
import Paper from '@/components/core/Paper.vue';

// 运行时
const runtime = reactive(new Runtime());
// const leftDrawer = toRef(runtime, 'leftDrawer');
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
const paperInstance = reactive(new PaperClass({}));
provide(paperInjectionKey, paperInstance);
onMounted(() => {
    if (!paperInstance.loadFromStorage()) {
        paperInstance.loadData(template1);
    }
    console.log(paperInstance);
});

// 复制粘贴
const { ctrl_c, ctrl_v } = useMagicKeys();
whenever(ctrl_c, () => {
    runtime.copyMaterialSet = new Set(runtime.activeMaterialSet);
});
whenever(ctrl_v, () => {
    paperInstance.copyMaterial([...runtime.copyMaterialSet]);
    runtime.copyMaterialSet.clear();
});

// 按del键删除
const { Delete } = useMagicKeys();
whenever(Delete, () => {
    paperInstance.removeMaterial([...runtime.activeMaterialSet]);
});

// ctrl+a全选
const { ctrl_a } = useMagicKeys();
whenever(ctrl_a, () => {
    for (const m of paperInstance.materialList) {
        runtime.activeMaterialSet.add(m.id);
    }
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
            ...new Set(
                added.map((mId) => paperInstance.queryMaterial(mId)?.groupId),
            ),
        ];
        const needRemoveGroupIdSet = [
            ...new Set(
                removed.map((mId) => paperInstance.queryMaterial(mId)?.groupId),
            ),
        ];
        needAddGroupIdSet.forEach((groupId) => {
            if (!groupId) return;
            paperInstance.queryGroupMaterials(groupId).forEach(({ id }) => {
                runtime.activeMaterialSet.add(id);
            });
        });
        needRemoveGroupIdSet.forEach((groupId) => {
            if (!groupId) return;
            paperInstance.queryGroupMaterials(groupId).forEach(({ id }) => {
                runtime.activeMaterialSet.delete(id);
            });
        });
    },
);
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
            <MaterialPrototype />
            <v-divider />
            <v-btn
                class="toggle-left-drawer-btn print-none"
                :class="{ 'position-hide': !runtime.leftDrawer }"
                :icon="
                    runtime.leftDrawer
                        ? 'mdi-chevron-left'
                        : 'mdi-chevron-right'
                "
                size="x-large"
                @click="runtime.leftDrawer = !runtime.leftDrawer"
            >
            </v-btn>
        </v-navigation-drawer>
        <v-main class="bg-grey-darken-3">
            <Sketch ref="sketch">
                <Paper />
                <v-btn @click="paperInstance.pageCount++">新增一页</v-btn>
            </Sketch>
            <WebsiteInfo />
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
