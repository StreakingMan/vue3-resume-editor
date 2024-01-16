<template>
    <div ref="eleRef" class="m-text" :class="classNames">
        {{ instance.config.content }}
        <textarea
            v-model="instance.config.content"
            :class="classNames"
            :style="{ color: instance.config.color }"
            wrap="hard"
            placeholder="请输入文本"
        />
    </div>
    <MaterialConfigPopover v-if="clicked">
        <template #activator>
            <slot name="activator"></slot>
        </template>
        <template #config>
            <ConfigItem title="字型">
                <v-slider
                    v-model="instance.config.typo"
                    :min="0"
                    :max="typographyClass.length - 1"
                    step="1"
                    show-ticks="always"
                    hide-details
                    thumb-label
                    thumb-color="primary"
                >
                    <template #thumb-label="{ modelValue }">
                        <div class="text-no-wrap">
                            {{
                                typographyClass[modelValue].replace('text-', '')
                            }}
                        </div>
                    </template>
                </v-slider>
            </ConfigItem>

            <ConfigItem title="字重">
                <v-slider
                    v-model="instance.config.fontWeight"
                    :min="0"
                    :max="fontWeightClass.length - 1"
                    step="1"
                    show-ticks="always"
                    hide-details
                    thumb-label
                    thumb-color="primary"
                >
                    <template #thumb-label="{ modelValue }">
                        <div class="text-no-wrap">
                            {{
                                fontWeightClass[modelValue]
                                    .replace('font-', '')
                                    .replace('weight-', '')
                            }}
                        </div>
                    </template>
                </v-slider>
            </ConfigItem>

            <ConfigItem title="对齐">
                <ConfigToggle v-model="instance.config.align" class="mx-2">
                    <template
                        v-for="{ icon, value } of textAlignOptions"
                        :key="value"
                    >
                        <ConfigToggleOption :value="value" :icon="icon" />
                    </template>
                </ConfigToggle>
            </ConfigItem>

            <ConfigItem title="字色">
                <Color v-model="instance.config.color" />
            </ConfigItem>
        </template>
    </MaterialConfigPopover>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, ref, toRef, watch } from 'vue';
import { ProtoInfo } from './prototypes';
import MaterialConfigPopover from '../core/MaterialConfigPopover.vue';
import {
    fontWeightClass,
    MaterialNames,
    textAlignOptions,
    typographyClass,
} from './config';
import { useMaterial } from '@/composables/useApp';
import ConfigItem from '../config-widgets/ConfigItem.vue';
import ConfigToggle from '../config-widgets/ConfigToggle.vue';
import ConfigToggleOption from '../config-widgets/ConfigToggleOption.vue';
import { MaterialBaseConfig } from '@/classes/Material';
import Color from '../config-widgets/Color.vue';

interface MTextConfig extends MaterialBaseConfig {
    content: string;
    typo: number;
    fontWeight: number;
    align: 'left' | 'center' | 'right';
    color: string;
}

const protoInfo: ProtoInfo<MTextConfig> = {
    label: '文本',
    icon: 'format-text',
    dragHandlers: ['ml', 'mr'],
    genInitOptions: ({ x, y }) => ({
        x: x - 100,
        y: y - 16,
        w: 200,
        h: 32,
        componentName: MaterialNames.MText,
        config: {
            content: '这是一段文本',
            typo: 5,
            fontWeight: 3,
            align: 'left',
            color: '#000',
        },
    }),
};

export default defineComponent({
    name: MaterialNames.MText,
    components: {
        Color,
        ConfigToggleOption,
        ConfigToggle,
        ConfigItem,
        MaterialConfigPopover,
    },
    protoInfo,
    setup() {
        const material = useMaterial<MTextConfig>();
        const { instance } = material;
        const eleRef = ref<HTMLDivElement | null>(null);
        const classNames = computed(() => {
            return [
                typographyClass[instance.config.typo],
                fontWeightClass[instance.config.fontWeight],
                'text-' + instance.config.align,
            ];
        });
        watch(
            () => ({
                padding: instance.config.padding,
                borderWidth: instance.config.borderWidth,
                w: instance.w,
                content: instance.config.content,
                typo: instance.config.typo,
                fontWeight: instance.config.fontWeight,
            }),
            async () => {
                await nextTick();
                if (eleRef.value) {
                    // 自适应内容高度
                    instance.h = eleRef.value.clientHeight;
                    const { padding, borderStyle, borderWidth } =
                        instance.config;
                    if (padding) {
                        instance.h += padding * 2;
                    }
                    if (borderStyle !== 'none' && borderWidth) {
                        instance.h += borderWidth * 2;
                    }
                }
            },
        );
        return {
            classNames,
            instance,
            eleRef,
            clicked: toRef(material, 'clicked'),
        };
    },
    data: () => ({
        typographyClass,
        fontWeightClass,
        textAlignOptions,
    }),
});
</script>

<style scoped lang="scss">
.m-text {
    position: relative;
    white-space: pre-wrap;
    word-break: break-word;
    color: transparent;
    textarea {
        width: 100%;
        height: calc(100% + 12px);
        position: absolute;
        white-space: pre-wrap;
        top: 0;
        left: 0;
        resize: none;
        word-break: break-word;
        color: inherit;
    }
}
</style>
