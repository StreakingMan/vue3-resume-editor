<template>
    <div
        class="divider w-100 h-100 divider d-flex align-center justify-center"
        :class="{ 'flex-column': instance.config.direction === 'vertical' }"
    >
        <div
            class="border-element flex-grow-1"
            :class="{
                horizontal: instance.config.direction === 'horizontal',
                vertical: instance.config.direction === 'vertical',
            }"
            :style="{
                borderColor: instance.config.color,
                borderWidth: instance.config.lineWidth + 'px',
                borderStyle: instance.config.style,
            }"
        ></div>
    </div>
    <MaterialConfigPopover>
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
            <ConfigItem title="粗细">
                <v-slider
                    v-model="instance.config.lineWidth"
                    min="1"
                    max="10"
                    step="1"
                    hide-details
                    thumb-label
                    thumb-color="primary"
                    show-ticks="always"
                ></v-slider>
            </ConfigItem>
            <ConfigItem title="颜色">
                <Color v-model="instance.config.color" />
            </ConfigItem>
            <ConfigItem title="样式">
                <BorderStyle v-model="instance.config.style" />
            </ConfigItem>
        </template>
    </MaterialConfigPopover>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import { ProtoInfo } from './prototypes';
import { M_DIVIDER_NAME } from './config';
import MaterialConfigPopover from '../core/MaterialConfigPopover.vue';
import { useMaterial } from '../../composables/useApp';
import ConfigItem from '../config-widgets/ConfigItem.vue';
import BorderStyle from '../config-widgets/BorderStyle.vue';
import ConfigToggle from '../config-widgets/ConfigToggle.vue';
import ConfigToggleOption from '../config-widgets/ConfigToggleOption.vue';
import Color from '../config-widgets/Color.vue';
import { MaterialBaseConfig } from '../../classes/Material';

interface MDividerConfig extends MaterialBaseConfig {
    direction: 'horizontal' | 'vertical';
    color: string;
    lineWidth: number;
    style: 'solid' | 'dashed' | 'dotted';
}

const protoInfo: ProtoInfo<MDividerConfig> = {
    label: '分割线',
    icon: 'border-horizontal',
    dragHandlers: ({ direction }) =>
        direction === 'horizontal' ? ['ml', 'mr'] : ['tm', 'bm'],
    genInitOptions: ({ y, paperInstance }) => ({
        componentName: M_DIVIDER_NAME,
        x: 10,
        y: y - paperInstance.cellSize,
        w: 600,
        h: paperInstance.cellSize * 2,
        _freePosition: true,
        config: {
            direction: 'horizontal',
            color: 'grey',
            lineWidth: 1,
            style: 'solid',
        },
    }),
};

export default defineComponent({
    name: 'MDivider',
    components: {
        Color,
        ConfigToggleOption,
        ConfigToggle,
        BorderStyle,
        ConfigItem,
        MaterialConfigPopover,
    },
    protoInfo,
    setup() {
        const { instance } = useMaterial<MDividerConfig>();

        // 方向改变中心旋转
        watch(
            () => ({ direction: instance.config.direction }),
            () => {
                instance.centerRotate();
            }
        );

        return {
            instance,
        };
    },
});
</script>

<style scoped lang="scss">
.divider {
    .border-element {
        &.horizontal {
            height: 0;
            border-top: none;
            border-left: none;
            border-right: none;
        }
        &.vertical {
            width: 0;
            border-top: none;
            border-left: none;
            border-bottom: none;
        }
    }
}
</style>
