<template>
    <v-icon :size="instance.config.size" :color="instance.config.color" style="vertical-align: top">
        mdi-{{ instance.config.icon }}
    </v-icon>
    <MaterialConfigPopover>
        <template #activator>
            <slot name="activator"></slot>
        </template>
        <template #config>
            <ConfigItem title="图标">
                <div class="flex-grow-1">
                    <v-text-field
                        v-model="searchIcon"
                        placeholder="输入英文搜索"
                        variant="outlined"
                        class="w-100"
                        density="compact"
                        clearable
                        hide-details
                        @keydown.stop
                    ></v-text-field>
                    <div class="text-caption my-2">
                        更详细的图标信息->
                        <a href="https://materialdesignicons.com/" target="_blank">
                            Material Design Icons
                        </a>
                    </div>
                    <v-sheet width="100%" max-height="200" class="overflow-y-auto">
                        <v-btn
                            v-for="icon of iconInfo
                                .filter((i) => i.name.includes(searchIcon))
                                .slice(0, 100)"
                            :key="icon.name"
                            :title="icon.name"
                            :color="instance.config.icon === icon.name ? 'primary' : ''"
                            variant="text"
                            :icon="`mdi-${icon.name}`"
                            size="x-small"
                            @click="() => (instance.config.icon = icon.name)"
                        >
                        </v-btn>
                    </v-sheet>
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
import { defineComponent, ref, watch } from 'vue';
import { type MaterialBaseConfig } from '@/classes/Material';
import { type ProtoInfo } from './prototypes';
import MaterialConfigPopover from '../core/MaterialConfigPopover.vue';
import { useMaterial } from '@/composables/useMaterial';
import ConfigItem from '../config-widgets/ConfigItem.vue';
import Color from '../config-widgets/Color.vue';
import { iconInfo } from './iconInfo';
import { MaterialNames } from '@/components/materials/config';

interface MIconConfig extends MaterialBaseConfig {
    icon: string;
    size: number;
    color: string;
}

const protoInfo: ProtoInfo<MIconConfig> = {
    label: '图标',
    icon: 'emoticon-cool-outline',
    dragHandlers: [],
    genInitOptions: ({ x, y }) => ({
        x: x - 12,
        y: y - 12,
        w: 24,
        h: 24,
        _freeSize: true,
        componentName: MaterialNames.MIcon,
        config: {
            icon: 'emoticon-cool-outline',
            size: 24,
            color: '#888',
        },
    }),
};

export default defineComponent({
    name: MaterialNames.MIcon,
    components: { Color, ConfigItem, MaterialConfigPopover },
    protoInfo,
    setup() {
        const material = useMaterial<MIconConfig>();
        const { instance } = material;
        watch(
            () => ({
                size: instance.config.size,
                padding: instance.config.padding,
                borderWidth: instance.config.borderWidth,
                borderStyle: instance.config.borderStyle,
            }),
            ({ size, padding = 0, borderWidth = 0, borderStyle }) => {
                if (borderStyle === 'none') borderWidth = 0;
                instance.w = size + padding * 2 + borderWidth * 2;
                instance.h = size + padding * 2 + borderWidth * 2;
            },
        );

        return {
            instance,
        };
    },
    data: () => ({
        iconInfo,
        searchIcon: '',
    }),
});
</script>
