<template>
    <v-menu v-model="visible" anchor="end">
        <template #activator="{ props }">
            <div
                class="activator"
                :style="{
                    transform: `translateY(${active ? -100 : 0}%) scale(${
                        1 / scale
                    })`,
                    opacity: active ? 1 : 0,
                }"
            >
                <slot name="activator"></slot>
                <v-btn
                    v-bind="props"
                    variant="outlined"
                    color="primary"
                    size="x-small"
                    :disabled="!active"
                    icon
                    :rounded="0"
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
import { defineComponent, toRef } from 'vue';
import { useMaterial, useRuntime } from '../../composables/useApp';
import ConfigItem from '../config-widgets/ConfigItem.vue';
import BorderStyle from '../config-widgets/BorderStyle.vue';
import Color from '../config-widgets/Color.vue';

export default defineComponent({
    name: 'MaterialConfigPopover',
    components: { Color, BorderStyle, ConfigItem },
    setup() {
        const runtime = useRuntime();
        const material = useMaterial();

        return {
            scale: toRef(runtime.scale, 'value'),
            hover: toRef(material, 'hover'),
            active: toRef(material, 'active'),
            instance: toRef(material, 'instance'),
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
