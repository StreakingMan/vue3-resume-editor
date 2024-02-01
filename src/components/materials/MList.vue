<template>
    <div
        class="d-flex flex-column m-list input"
        :class="classNames"
        :style="{
            color: instance.config.color,
            gap: instance.config.gap + 'px',
            top: (instance.config.padding || 0) + (instance.config.borderWidth || 0) + 'px',
            left: (instance.config.padding || 0) + (instance.config.borderWidth || 0) + 'px',
        }"
    >
        <div
            v-for="(item, idx) in instance.config.items.slice(0, instance.config.itemLength)"
            :key="idx"
            class="d-flex align-start"
        >
            <span v-if="instance.config.dotType === 'numeric'"> {{ idx + 1 }}. </span>
            <v-icon v-else class="mr-1"> mdi-{{ instance.config.dotType }} </v-icon>
            <textarea
                :value="item"
                :style="{ height: itemHeights[idx] + 'px !important' }"
                wrap="hard"
                placeholder="请输入文本"
                @input="
                    (e) => (instance.config.items[idx] = (e.target as HTMLTextAreaElement)?.value)
                "
                @keydown.stop
            ></textarea>
        </div>
    </div>
    <div
        class="d-flex flex-column m-list placeholder"
        :class="classNames"
        :style="{
            color: instance.config.color,
            gap: instance.config.gap + 'px',
        }"
    >
        <div
            v-for="(item, idx) in instance.config.items.slice(0, instance.config.itemLength)"
            :key="idx"
            :ref="(el) => setItemRef(el as any, idx)"
            class="d-flex align-start"
        >
            <span v-if="instance.config.dotType === 'numeric'"> {{ idx + 1 }}. </span>
            <v-icon v-else class="mr-1"> mdi-{{ instance.config.dotType }} </v-icon>
            <div>{{ item }}</div>
        </div>
    </div>
    <MaterialConfigPopover>
        <template #activator>
            <slot name="activator"></slot>
        </template>
        <template #config>
            <ConfigItem title="数量">
                <v-slider
                    v-model="instance.config.itemLength"
                    :min="1"
                    :max="10"
                    step="1"
                    hide-details
                    thumb-label
                    show-ticks="always"
                >
                </v-slider>
            </ConfigItem>

            <ConfigItem title="样式">
                <div class="d-flex flex-wrap flex-shrink-1">
                    <v-btn
                        v-for="dot in dots"
                        :key="dot"
                        icon
                        size="x-small"
                        flat
                        :color="instance.config.dotType === dot ? 'primary' : ''"
                        @click="instance.config.dotType = dot"
                    >
                        <v-icon>mdi-{{ dot }}</v-icon>
                    </v-btn>
                </div>
            </ConfigItem>

            <ConfigItem title="间距">
                <v-slider
                    v-model="instance.config.gap"
                    :min="0"
                    :max="36"
                    step="1"
                    hide-details
                    thumb-label
                >
                </v-slider>
            </ConfigItem>

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
                            {{ typographyClass[modelValue].replace('text-', '') }}
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

            <ConfigItem title="字色">
                <Color v-model="instance.config.color" />
            </ConfigItem>
        </template>
    </MaterialConfigPopover>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, ref, watch } from 'vue';
import { type MaterialBaseConfig } from '@/classes/Material';
import { type ProtoInfo } from './prototypes';
import { fontWeightClass, MaterialNames, typographyClass } from './config';
import MaterialConfigPopover from '../core/MaterialConfigPopover.vue';
import { useMaterial } from '@/composables/useMaterial';
import ConfigItem from '../config-widgets/ConfigItem.vue';
import Color from '../config-widgets/Color.vue';

type DotType =
    | 'chevron-right'
    | 'square'
    | 'square-small'
    | 'square-outline'
    | 'square-medium'
    | 'square-medium-outline'
    | 'circle'
    | 'circle-small'
    | 'circle-outline'
    | 'circle-medium'
    | 'numeric';

interface MListConfig extends MaterialBaseConfig {
    items: string[];
    itemLength: number;
    dotType: DotType;
    typo: number;
    fontWeight: number;
    color: string;
    gap: number;
}

const dots: DotType[] = [
    'chevron-right',
    'square',
    'square-small',
    'square-outline',
    'square-medium',
    'square-medium-outline',
    'circle',
    'circle-small',
    'circle-outline',
    'circle-medium',
    'numeric',
];

const protoInfo: ProtoInfo<MListConfig> = {
    label: '列表',
    icon: 'format-list-bulleted-type',
    dragHandlers: ['ml', 'mr'],
    genInitOptions: ({ x, y }) => ({
        x: x - 100,
        y: y - 33,
        w: 200,
        h: 66,
        componentName: MaterialNames.MList,
        config: {
            items: [
                '列表项目1',
                '列表项目2',
                '列表项目3',
                '列表项目4',
                '列表项目5',
                '列表项目6',
                '列表项目7',
                '列表项目8',
                '列表项目9',
                '列表项目10',
            ],
            itemLength: 3,
            dotType: 'chevron-right',
            typo: 7,
            fontWeight: 3,
            color: '#000',
            gap: 4,
        },
    }),
};

export default defineComponent({
    name: MaterialNames.MList,
    components: {
        Color,
        ConfigItem,
        MaterialConfigPopover,
    },
    protoInfo,
    setup() {
        const material = useMaterial<MListConfig>();
        const { instance } = material;
        const classNames = computed(() => {
            return [
                typographyClass[instance.config.typo],
                fontWeightClass[instance.config.fontWeight],
            ];
        });
        const itemRefs: HTMLDivElement[] = [];
        const itemHeights = ref<number[]>([]);
        const setItemRef = (el: HTMLDivElement, idx: number) => {
            if (el) {
                itemRefs[idx] = el;
            }
        };
        const updateInputsHeight = () => {
            itemRefs.forEach((ref, idx) => {
                itemHeights.value[idx] = ref.clientHeight;
            });
        };
        onMounted(() => {
            updateInputsHeight();
        });
        watch(
            () => ({
                itemLength: instance.config.itemLength,
                items: instance.config.items.toString(),
                width: instance.w,
            }),
            async () => {
                await nextTick();
                updateInputsHeight();
                instance.h = itemHeights.value.reduce((a, b) => a + b);
            },
        );
        return {
            setItemRef,
            itemHeights,
            classNames,
            instance,
        };
    },
    data: () => ({
        typographyClass,
        fontWeightClass,
        dots,
    }),
});
</script>

<style scoped lang="scss">
.m-list {
    &.input {
        position: absolute;
        width: 100%;
        z-index: 2;

        textarea {
            resize: none;
            word-break: break-word;
            white-space: pre-wrap;
            width: 100%;
            color: inherit;
        }
    }

    &.placeholder {
        white-space: pre-wrap;
        word-break: break-word;
        //color: red !important;
        opacity: 0;
        z-index: 1;
    }
}
</style>
