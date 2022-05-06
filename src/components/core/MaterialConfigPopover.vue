<template>
    <v-menu v-model="visible" anchor="end">
        <template #activator="{ props }">
            <div
                class="activator"
                :style="{
                    transform: `translateY(-100%) scale(${1 / scale})`,
                }"
            >
                <!-- 移动 -->
                <v-btn
                    ref="moveHandlerRef"
                    variant="outlined"
                    color="primary"
                    size="x-small"
                    icon
                    class="border-r-0"
                    :rounded="0"
                >
                    <v-icon size="x-small">mdi-arrow-all</v-icon>
                    <v-tooltip activator="parent" anchor="top">
                        拖拽移动
                    </v-tooltip>
                </v-btn>
                <slot name="activator"></slot>
                <!-- 配置面板 -->
                <v-btn
                    v-bind="props"
                    variant="outlined"
                    color="primary"
                    size="x-small"
                    icon
                    :rounded="0"
                    @mousedown.stop
                >
                    <v-icon size="x-small">mdi-cog</v-icon>
                    <v-tooltip activator="parent" anchor="top">
                        配置面板
                    </v-tooltip>
                </v-btn>
            </div>
        </template>
        <v-sheet rounded width="400" class="px-6 py-8">
            <slot name="config"></slot>
            <template
                v-if="!['MDivider', 'MRating'].includes(instance.componentName)"
            >
                <v-divider class="my-3 mx-n6"></v-divider>
                <ConfigItem title="内边距">
                    <v-slider
                        v-model="instance.config.padding"
                        step="1"
                        min="0"
                        :max="
                            instance.w > instance.h
                                ? instance.h / 2
                                : instance.w / 2
                        "
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
                        :max="
                            instance.w > instance.h
                                ? instance.h / 2
                                : instance.w / 2
                        "
                        color="primary"
                        thumb-label
                        hide-details
                    ></v-slider>
                </ConfigItem>
                <ConfigItem title="边框样式">
                    <BorderStyle
                        v-model="instance.config.borderStyle"
                        has-null
                    />
                </ConfigItem>
                <template
                    v-if="
                        instance.config.borderStyle &&
                        instance.config.borderStyle !== 'none'
                    "
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
import { useMaterial, usePaper, useRuntime } from '../../composables/useApp';
import ConfigItem from '../config-widgets/ConfigItem.vue';
import BorderStyle from '../config-widgets/BorderStyle.vue';
import Color from '../config-widgets/Color.vue';
import useMouseDrag, { MouseEvtInfo } from '../../composables/useMouseDrag';

export default defineComponent({
    name: 'MaterialConfigPopover',
    components: { Color, BorderStyle, ConfigItem },
    setup() {
        const runtime = useRuntime();
        const paper = usePaper();
        const material = useMaterial();

        // 所有激活元素的位置缓存
        const posInfoCacheMap = new Map();
        // 元素移动
        const moveHandlerRef = ref(null);
        useMouseDrag({
            onStart() {
                if (runtime.keyboardStatus.space) return false;
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
                    mInstance.x =
                        posInfoCache.itemStartX + transX / runtime.scale.value;
                    mInstance.y =
                        posInfoCache.itemStartY + transY / runtime.scale.value;
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
    top: 0;
    transition: 0.3s;
    transform: translateY(-100%);
    transform-origin: right bottom;
    min-width: max-content;
    background-color: rgba(255, 255, 255, 0.6);
}
</style>
