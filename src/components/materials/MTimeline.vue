<script lang="ts">
import { type MaterialBaseConfig } from '@/classes/Material';
import { type ProtoInfo } from '@/components/materials/prototypes';
import { MaterialNames } from '@/components/materials/config';

interface MTimelineConfig extends MaterialBaseConfig {
    direction: 'vertical' | 'horizontal';
    dots: {
        weight: number;
        color: string;
        size: number;
    }[];
}

const protoInfo: ProtoInfo<MTimelineConfig> = {
    label: '时间轴',
    icon: 'timeline-text',
    dragHandlers: ({ direction }) => (direction === 'horizontal' ? ['ml', 'mr'] : ['tm', 'bm']),
    genInitOptions: ({ x, y }) => ({
        x: x - 50,
        y: y - 100,
        w: 100,
        h: 200,
        componentName: MaterialNames.MTimeline,
        config: {
            direction: 'vertical',
            dots: [
                { color: '#333', size: 20, weight: 1 },
                { color: '#666', size: 10, weight: 1 },
                { color: '#666', size: 10, weight: 1 },
            ],
        },
    }),
};

export default {
    protoInfo,
};
</script>

<script setup lang="ts">
import { computed, toRef, watch } from 'vue';
import { useMaterial } from '@/composables/useApp';
import MaterialConfigPopover from '@/components/core/MaterialConfigPopover.vue';
import ConfigToggle from '@/components/config-widgets/ConfigToggle.vue';
import ConfigItem from '@/components/config-widgets/ConfigItem.vue';
import ConfigToggleOption from '@/components/config-widgets/ConfigToggleOption.vue';
import Color from '@/components/config-widgets/Color.vue';

const material = useMaterial<MTimelineConfig>();
const { instance } = material;
const clicked = toRef(material, 'clicked');

// 方向改变长宽对调
watch(
    () => ({ direction: instance.config.direction }),
    () => {
        const { w, h } = instance;
        instance.w = h;
        instance.h = w;
    },
);

const totalWeight = computed(() => instance.config.dots.reduce((acc, cur) => acc + cur.weight, 0));
const contentPixel = computed(() => {
    if (instance.config.direction === 'horizontal') {
        return instance.w - 24 * (instance.config.dots.length + 1);
    } else {
        return instance.h - 24 * (instance.config.dots.length + 1);
    }
});
</script>

<template>
    <div class="w-100 h-100 d-flex align-center justify-center">
        <v-timeline side="end" :direction="instance.config.direction">
            <v-timeline-item
                v-for="(dot, i) in instance.config.dots"
                :key="i"
                :dot-color="dot.color"
                :size="dot.size"
            >
                <div
                    :style="{
                        width:
                            instance.config.direction === 'horizontal'
                                ? (dot.weight / totalWeight) * contentPixel + 'px'
                                : '0',
                        height:
                            instance.config.direction === 'vertical'
                                ? (dot.weight / totalWeight) * contentPixel + 'px'
                                : '0',
                    }"
                ></div>
            </v-timeline-item>
        </v-timeline>
    </div>

    <MaterialConfigPopover v-if="clicked">
        <template #activator>
            <slot name="activator"></slot>
        </template>
        <template #config>
            <ConfigItem title="方向">
                <ConfigToggle v-model="instance.config.direction">
                    <ConfigToggleOption label="水平" value="horizontal" />
                    <ConfigToggleOption label="垂直" value="vertical" />
                </ConfigToggle>
            </ConfigItem>

            <ConfigItem title="分段">
                <div class="d-flex flex-column ga-2 flex-grow-1 my-4">
                    <div
                        v-for="(dot, idx) in instance.config.dots"
                        :key="idx"
                        class="d-flex align-center ga-2"
                    >
                        <v-text-field
                            v-model.number="dot.weight"
                            label="权重"
                            variant="outlined"
                            hide-details
                            density="compact"
                        ></v-text-field>

                        <Color v-model="dot.color" no-margin />

                        <v-slider
                            v-model.number="dot.size"
                            step="1"
                            min="1"
                            max="30"
                            color="primary"
                            thumb-label
                            hide-details
                        ></v-slider>

                        <v-btn
                            density="compact"
                            icon="mdi-close"
                            variant="tonal"
                            @click="instance.config.dots.splice(idx, 1)"
                        ></v-btn>
                    </div>

                    <v-btn
                        variant="tonal"
                        block
                        @click="
                            () =>
                                instance.config.dots.push({
                                    weight: 1,
                                    color: '#000',
                                    size: 10,
                                })
                        "
                    >
                        增加分段
                    </v-btn>
                </div>
            </ConfigItem>
        </template>
    </MaterialConfigPopover>
</template>
