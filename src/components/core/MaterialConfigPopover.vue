<script setup lang="ts">
import { nextTick, ref, toRefs } from 'vue';
import { useMaterial } from '@/composables/useMaterial';
import ConfigItem from '../config-widgets/ConfigItem.vue';
import BorderStyle from '../config-widgets/BorderStyle.vue';
import Color from '../config-widgets/Color.vue';
import useMouseDragDynamic, { type MouseEvtInfo } from '../../composables/useMouseDragDynamic';
import { useMagicKeys, whenever } from '@vueuse/core';
import { useRuntime } from '@/composables/useRuntime';
import { usePaper } from '@/composables/usePaper';

const visible = ref(false);

const runtime = useRuntime();
const paper = usePaper();
const { instance, hover } = toRefs(useMaterial());
const { space } = useMagicKeys();

whenever(
    () => !hover.value,
    () => {
        visible.value = false;
    },
);

// 所有激活元素的位置缓存
const posInfoCacheMap = new Map();
// 元素移动
const moveHandlerRef = ref(null);
useMouseDragDynamic({
    onStart() {
        if (space.value) return false;
        // 拖动非激活元素时，重置激活集合
        if (!runtime.activeMaterialSet.has(instance.value.id)) {
            runtime.activeMaterialSet.clear();
            runtime.activeMaterialSet.add(instance.value.id);
        }

        nextTick().then(() => {
            // 拖动的元素挂载了分组时，批量移动
            for (const mId of runtime.activeMaterialSet) {
                const mInstance = paper.queryMaterial(mId);
                if (!mInstance) continue;
                const { x, y } = mInstance;
                posInfoCacheMap.set(mId, {
                    itemStartX: x,
                    itemStartY: y,
                });
            }
        });
    },
    onDrag({ transX, transY }: MouseEvtInfo) {
        for (const mId of runtime.activeMaterialSet) {
            const mInstance = paper.queryMaterial(mId);
            if (!mInstance) continue;
            const posInfoCache = posInfoCacheMap.get(mId);
            mInstance.x = posInfoCache.itemStartX + transX / runtime.scale.value;
            mInstance.y = posInfoCache.itemStartY + transY / runtime.scale.value;
        }
    },
    onFinish() {
        posInfoCacheMap.clear();
    },
    bindElementRef: moveHandlerRef,
});
</script>

<template>
    <v-menu v-if="hover" v-model="visible" anchor="end" :close-on-content-click="false">
        <template #activator="{ props }">
            <v-sheet
                class="activator text-blue-darken-3 bg-white"
                border
                :style="{
                    transform: `translateY(-100%) scale(${1 / runtime.scale.value})`,
                }"
            >
                <v-defaults-provider
                    :defaults="{
                        VBtn: {
                            density: 'comfortable',
                            icon: true,
                            flat: true,
                            size: 'small',
                        },
                    }"
                >
                    <!-- 移动 -->
                    <v-btn ref="moveHandlerRef">
                        <v-icon>mdi-arrow-all</v-icon>
                    </v-btn>
                    <slot name="activator"></slot>
                    <!-- 配置面板 -->
                    <v-btn v-bind="props" @mousedown.stop>
                        <v-icon>mdi-cog</v-icon>
                    </v-btn>
                </v-defaults-provider>
            </v-sheet>
        </template>
        <v-sheet rounded width="400" class="px-6 py-8">
            <slot name="config"></slot>
            <template v-if="!['MDivider', 'MRating'].includes(instance.componentName)">
                <v-divider class="my-3 mx-n6"></v-divider>
                <ConfigItem title="内边距">
                    <v-slider
                        v-model="instance.config.padding"
                        step="1"
                        min="0"
                        :max="instance.w > instance.h ? instance.h / 2 : instance.w / 2"
                        color="primary"
                        thumb-label
                        hide-details
                    ></v-slider>
                </ConfigItem>
                <ConfigItem title="圆角">
                    <v-slider
                        v-model="instance.config.borderRadius"
                        step="1"
                        min="0"
                        :max="instance.w > instance.h ? instance.h / 2 : instance.w / 2"
                        color="primary"
                        thumb-label
                        hide-details
                    ></v-slider>
                </ConfigItem>
                <ConfigItem title="边框样式">
                    <BorderStyle v-model="instance.config.borderStyle" has-null />
                </ConfigItem>
                <template
                    v-if="instance.config.borderStyle && instance.config.borderStyle !== 'none'"
                >
                    <ConfigItem title="边框粗细">
                        <v-slider
                            v-model="instance.config.borderWidth"
                            step="1"
                            min="0"
                            max="18"
                            color="primary"
                            show-ticks="always"
                            hide-details
                            thumb-label
                        ></v-slider>
                    </ConfigItem>
                    <ConfigItem title="边框颜色">
                        <Color v-model="instance.config.borderColor" />
                    </ConfigItem>
                </template>
                <ConfigItem title="背景色">
                    <Color v-model="instance.config.backgroundColor" />
                </ConfigItem>
            </template>
        </v-sheet>
    </v-menu>
</template>

<style scoped lang="scss">
.activator {
    position: absolute;
    right: 0;
    top: 0;
    transform: translateY(-100%);
    transform-origin: right bottom;
    min-width: max-content;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 15px 15px 0 0;
}
</style>
