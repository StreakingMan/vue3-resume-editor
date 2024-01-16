<script lang="ts">
import { computed, defineComponent, nextTick, toRef, watch } from 'vue';
import { MaterialBaseConfig } from '@/classes/Material';
import { ProtoInfo } from '@/components/materials/prototypes';
import {
    fontWeightClass,
    MaterialNames,
    typographyClass,
} from '@/components/materials/config';
import { useMaterial } from '@/composables/useApp';
import MaterialConfigPopover from '@/components/core/MaterialConfigPopover.vue';
import ConfigItem from '@/components/config-widgets/ConfigItem.vue';
import BorderStyle from '@/components/config-widgets/BorderStyle.vue';
import Color from '@/components/config-widgets/Color.vue';

interface MPieConfig extends MaterialBaseConfig {
    pieBorderStyle?: string;
    pieBorderWidth?: number;
    pieBorderColor?: string;
    data: {
        name: string;
        value: number;
        color: string;
    }[];
    typo: number;
    fontWeight: number;
}

const protoInfo: ProtoInfo<MPieConfig> = {
    label: '饼图',
    icon: 'chart-pie',
    dragHandlers: ['br'],
    genInitOptions: ({ x, y }) => ({
        x: x - 150,
        y: y - 150,
        w: 250,
        h: 150,
        componentName: MaterialNames.MPie,
        config: {
            pieBorderStyle: 'none',
            pieBorderWidth: 0,
            pieBorderColor: '#000',
            data: [
                { name: 'Vue', value: 2, color: 'orange' },
                { name: 'React', value: 2, color: 'cyan' },
                { name: 'TS', value: 2, color: 'pink' },
            ],
            typo: 5,
            fontWeight: 3,
        },
    }),
};

export default defineComponent({
    name: MaterialNames.MPie,
    components: { Color, BorderStyle, ConfigItem, MaterialConfigPopover },
    setup() {
        const material = useMaterial<MPieConfig>();
        const { instance } = material;

        // 保持长宽比
        watch(
            () => ({
                w: instance.w,
            }),
            async () => {
                await nextTick();
                instance.h = instance.w * 0.6;
            },
        );

        const totalValue = computed(() =>
            instance.config.data.reduce((acc, cur) => acc + cur.value, 0),
        );

        const background = computed(() => {
            const { data } = instance.config;
            const total = totalValue.value;
            let lastAngle = 0;
            const colorAngles: string[] = [];
            data.forEach((item) => {
                const angle = (item.value / total) * 360;
                colorAngles.push(
                    `${item.color} ${lastAngle}deg ${lastAngle + angle}deg`,
                );
                lastAngle += angle;
            });
            return `conic-gradient(${colorAngles.join(', ')})`;
        });

        const fontClassNames = computed(() => {
            return [
                typographyClass[instance.config.typo],
                fontWeightClass[instance.config.fontWeight],
            ];
        });

        return {
            fontClassNames,
            instance,
            background,
            totalValue,
            clicked: toRef(material, 'clicked'),
        };
    },
    data: () => ({
        typographyClass,
        fontWeightClass,
    }),
    protoInfo,
});
</script>

<template>
    <div
        class="pie"
        :style="{
            borderStyle: instance.config.pieBorderStyle,
            borderWidth: instance.config.pieBorderWidth + 'px',
            borderColor: instance.config.pieBorderColor,
            background,
        }"
    ></div>
    <div class="labels" :class="fontClassNames">
        <div
            v-for="(data, idx) in instance.config.data"
            :key="idx"
            :style="{
                color: data.color,
            }"
            class="label-item"
        >
            <div
                class="color-block"
                :style="{
                    backgroundColor: data.color,
                }"
            ></div>
            {{ data.name }}
        </div>
    </div>
    <MaterialConfigPopover v-if="clicked">
        <template #activator>
            <slot name="activator"></slot>
        </template>
        <template #config>
            <ConfigItem title="数据项">
                <div class="d-flex flex-column ga-2 flex-grow-1">
                    <div
                        v-for="(item, idx) in instance.config.data"
                        :key="idx"
                        class="d-flex align-center ga-2"
                    >
                        <v-text-field
                            v-model="item.name"
                            label="名称"
                            variant="outlined"
                            hide-details
                            density="compact"
                        ></v-text-field>
                        <v-text-field
                            v-model.number="item.value"
                            label="权重"
                            variant="outlined"
                            hide-details
                            density="compact"
                        ></v-text-field>
                        <Color v-model="item.color" class="ml-1" />

                        <v-btn
                            density="compact"
                            icon="mdi-close"
                            variant="tonal"
                            @click="instance.config.data.splice(idx, 1)"
                        ></v-btn>
                    </div>

                    <v-btn
                        class="mb-4"
                        variant="tonal"
                        block
                        @click="
                            () =>
                                instance.config.data.push({
                                    name: '',
                                    value: 0,
                                    color: '#000',
                                })
                        "
                    >
                        增加数据项
                    </v-btn>
                </div>
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

            <ConfigItem title="边框样式">
                <BorderStyle
                    v-model="instance.config.pieBorderStyle"
                    has-null
                />
            </ConfigItem>
            <template
                v-if="
                    instance.config.pieBorderStyle &&
                    instance.config.pieBorderStyle !== 'none'
                "
            >
                <ConfigItem title="边框粗细">
                    <v-slider
                        v-model="instance.config.pieBorderWidth"
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
                    <Color v-model="instance.config.pieBorderColor" />
                </ConfigItem>
            </template>
        </template>
    </MaterialConfigPopover>
</template>

<style scoped lang="scss">
.pie {
    width: 60%;
    height: 100%;
    border-radius: 50%;
    position: relative;
}
.labels {
    width: 40%;
    position: absolute;
    right: 0;
    top: 0;
    padding-left: 0.5em;
    .label-item {
        display: flex;
        align-items: center;
        gap: 0.5em;
        word-break: break-all;
    }
    .color-block {
        width: 1em;
        min-width: 1em;
        height: 1em;
        border-radius: 50%;
        display: inline-block;
    }
}
</style>
