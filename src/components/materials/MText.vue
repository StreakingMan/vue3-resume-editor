<template>
    <div ref="eleRef" class="m-text" :class="classNames">
        {{ instance.config.content }}
        <textarea
            v-model="instance.config.content"
            :class="classNames"
            :style="{ color: instance.config.color }"
            wrap="hard"
            @mousedown.stop
        />
    </div>
    <MaterialConfigPopover>
        <template #activator>
            <slot name="activator"></slot>
        </template>
        <template #config>
            <div class="d-flex align-center">
                <div class="text-subtitle-2">尺寸：</div>
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
            </div>

            <div class="d-flex align-center">
                <div class="text-subtitle-2">字重：</div>
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
            </div>

            <div class="d-flex align-center">
                <div class="text-subtitle-2">对齐：</div>
                <v-btn-toggle
                    v-model="instance.config.align"
                    color="primary"
                    class="border mx-2"
                    style="height: 36px"
                    divided
                >
                    <template
                        v-for="{ icon, value } of textAlignOptions"
                        :key="value"
                    >
                        <v-btn
                            :value="value"
                            variant="text"
                            :icon="icon"
                            size="small"
                        ></v-btn>
                    </template>
                </v-btn-toggle>
            </div>

            <div class="d-flex align-center">
                <div class="text-subtitle-2">字色：</div>
                <v-menu>
                    <template #activator="{ props }">
                        <v-sheet
                            width="24"
                            height="24"
                            class="border rounded ma-2"
                            :color="instance.config.color"
                            v-bind="props"
                            style="cursor: pointer"
                        >
                        </v-sheet>
                    </template>
                    <v-color-picker
                        v-model="instance.config.color"
                        show-swatches
                    ></v-color-picker>
                </v-menu>
            </div>
        </template>
    </MaterialConfigPopover>
</template>

<script lang="ts">
import { computed, defineComponent, inject, nextTick, ref, watch } from 'vue';
import { Material } from '../../classes/Material';
import { ProtoInfo } from './prototypes';
import MaterialConfigPopover from '../core/MaterialConfigPopover.vue';
import { M_TEXT_NAME } from './config';

const typographyClass = [
    'text-h1',
    'text-h2',
    'text-h3',
    'text-h4',
    'text-h5',
    'text-h6',
    'text-subtitle-1',
    'text-subtitle-2',
    'text-body-1',
    'text-body-2',
    'text-button',
    'text-caption',
    'text-overline',
];
const fontWeightClass = [
    'font-weight-black',
    'font-weight-bold',
    'font-weight-medium',
    'font-weight-regular',
    'font-weight-light',
    'font-weight-thin',
    'font-italic',
];
const textAlignOptions: Array<{
    icon: string;
    value: MTextConfig['align'];
}> = [
    {
        icon: 'mdi-format-align-left',
        value: 'left',
    },
    {
        icon: 'mdi-format-align-center',
        value: 'center',
    },
    {
        icon: 'mdi-format-align-right',
        value: 'right',
    },
];

interface MTextConfig {
    content: string;
    typo: number;
    fontWeight: number;
    align: 'left' | 'center' | 'right';
    color: string;
}

export default defineComponent({
    name: M_TEXT_NAME,
    components: { MaterialConfigPopover },
    protoInfo: {
        label: '文本',
        icon: 'format-text',
        dragHandlers: ['ml', 'mr'],
        creator({ x, y }) {
            return new Material({
                x: x! - 100,
                y: y! - 16,
                w: 200,
                h: 32,
                config: {
                    componentName: M_TEXT_NAME,
                    content: '这是一段文本',
                    typo: 5,
                    fontWeight: 3,
                    align: 'left',
                    color: '#000',
                },
            });
        },
    } as ProtoInfo<MTextConfig>,
    setup() {
        const instance: Material<MTextConfig> = inject('m-instance', {
            config: {},
        }) as Material<MTextConfig>;
        const eleRef = ref<HTMLDivElement | null>(null);
        const classNames = computed(() => {
            return [
                typographyClass[instance.config.typo],
                fontWeightClass[instance.config.fontWeight],
                'text-' + instance.config.align,
            ];
        });
        watch(instance, async () => {
            if (eleRef.value) {
                await nextTick();
                // 自适应内容高度
                instance.h = eleRef.value.clientHeight;
            }
        });
        return {
            classNames,
            instance,
            eleRef,
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
    }
}
</style>
