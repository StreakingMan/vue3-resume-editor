<template>
    <v-menu v-model="visible" anchor="end" :close-on-content-click="false">
        <template #activator="{ props }">
            <v-sheet
                class="activator text-blue-darken-3 bg-white"
                rounded="pill"
                border
                :style="{
                    transform: `translateY(-100%) scale(${1 / scale})`,
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

<script lang="ts">
import { defineComponent, nextTick, ref, toRef } from 'vue';
import { useMaterial, usePaper } from '@/composables/useApp';
import ConfigItem from '../config-widgets/ConfigItem.vue';
import BorderStyle from '../config-widgets/BorderStyle.vue';
import Color from '../config-widgets/Color.vue';
import useMouseDragDynamic, { type MouseEvtInfo } from '../../composables/useMouseDragDynamic';
import { useMagicKeys } from '@vueuse/core';
import { useRuntime } from '@/composables/useRuntime';

export default defineComponent({
    name: 'MaterialConfigPopover',
    components: { Color, BorderStyle, ConfigItem },
    setup() {
        const runtime = useRuntime();
        const paper = usePaper();
        const material = useMaterial();
        const { space } = useMagicKeys();

        // 所有激活元素的位置缓存
        const posInfoCacheMap = new Map();
        // 元素移动
        const moveHandlerRef = ref(null);
        useMouseDragDynamic({
            onStart() {
                if (space.value) return false;
                // 拖动非激活元素时，重置激活集合
                if (!runtime.activeMaterialSet.has(material.instance.id)) {
                    runtime.activeMaterialSet.clear();
                    runtime.activeMaterialSet.add(material.instance.id);
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

        return {
            scale: toRef(runtime.scale, 'value'),
            moveHandlerRef,
            instance: material.instance,
        };
    },
    data: () => ({
        visible: false,
    }),
});
</script>

<style scoped lang="scss">
.activator {
    position: absolute;
    right: 0;
    top: -4px;
    transform: translateY(-100%);
    transform-origin: right bottom;
    min-width: max-content;
    background-color: rgba(255, 255, 255, 0.6);
}
</style>
