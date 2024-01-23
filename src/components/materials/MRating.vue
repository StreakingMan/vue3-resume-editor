<template>
    <v-rating
        ref="ratingRef"
        v-model="instance.config.rating"
        :color="instance.config.color"
        :size="instance.config.size"
        :full-icon="styleTypeIconMap[instance.config.style][0]"
        :half-icon="styleTypeIconMap[instance.config.style][1]"
        :empty-icon="styleTypeIconMap[instance.config.style][2]"
        hover
        half-increments
        density="compact"
    ></v-rating>
    <MaterialConfigPopover v-if="clicked">
        <template #activator>
            <slot name="activator"></slot>
        </template>
        <template #config>
            <ConfigItem title="样式">
                <div class="d-flex flex-wrap flex-shrink-1">
                    <v-btn
                        v-for="(iconList, name) in styleTypeIconMap"
                        :key="name"
                        icon
                        size="x-small"
                        flat
                        :color="instance.config.style === name ? 'primary' : ''"
                        @click="instance.config.style = name"
                    >
                        <v-icon>{{ iconList[1] }}</v-icon>
                    </v-btn>
                </div>
            </ConfigItem>
            <ConfigItem title="颜色">
                <Color v-model="instance.config.color" />
            </ConfigItem>
            <ConfigItem title="大小">
                <v-slider
                    v-model="instance.config.size"
                    min="12"
                    max="48"
                    step="1"
                    thumb-label
                    hide-details
                    color="primary"
                />
            </ConfigItem>
        </template>
    </MaterialConfigPopover>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref, toRef, watch } from 'vue';
import { type MaterialBaseConfig } from '@/classes/Material';
import { type ProtoInfo } from './prototypes';
import MaterialConfigPopover from '../core/MaterialConfigPopover.vue';
import { useMaterial } from '@/composables/useApp';
import ConfigItem from '../config-widgets/ConfigItem.vue';
import Color from '../config-widgets/Color.vue';
import { MaterialNames } from '@/components/materials/config';

interface MRatingConfig extends MaterialBaseConfig {
    style: StyleType;
    size: number;
    rating: number;
    color: string;
}

type StyleType = 'star' | 'star2' | 'circle' | 'circle2' | 'line' | 'flash';

const styleTypeIconMap: Record<StyleType, [string, string, string]> = {
    star: ['mdi-star', 'mdi-star-half-full', 'mdi-star-outline'],
    star2: ['mdi-star', 'mdi-star-half', ''],
    circle: ['mdi-circle', 'mdi-circle-half-full', 'mdi-circle-outline'],
    circle2: ['mdi-circle', 'mdi-circle-half', ''],
    line: ['mdi-window-minimize', 'mdi-window-minimize', ''],
    flash: ['mdi-flash', 'mdi-flash', ''],
};

const protoInfo: ProtoInfo<MRatingConfig> = {
    label: '评分',
    icon: 'star-half-full',
    dragHandlers: [],
    genInitOptions: ({ x, y }) => ({
        x: x - 70,
        y: y - 14,
        w: 140,
        h: 28,
        componentName: MaterialNames.MRating,
        config: {
            style: 'star',
            size: 28,
            rating: 4,
            color: 'rgba(0,0,0,1)',
        },
    }),
};

export default defineComponent({
    name: MaterialNames.MRating,
    components: { Color, ConfigItem, MaterialConfigPopover },
    protoInfo,
    setup() {
        const material = useMaterial<MRatingConfig>();
        const { instance } = material;
        const ratingRef = ref<HTMLDivElement | null>(null);
        watch(
            () => ({ size: instance.config.size }),
            async ({ size }) => {
                await nextTick();
                instance.w = size * 5;
                if (ratingRef.value) {
                    // @ts-ignore
                    instance.h = ratingRef.value.$el.clientHeight;
                }
            },
        );
        return {
            ratingRef,
            instance,
            clicked: toRef(material, 'clicked'),
        };
    },
    data: () => ({ styleTypeIconMap }),
});
</script>
