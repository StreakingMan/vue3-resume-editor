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
            <div class="d-flex align-center">
                <div class="text-subtitle-2">方向：</div>
                <v-btn-toggle
                    v-model="instance.config.direction"
                    color="primary"
                    class="border"
                    style="height: 36px"
                    divided
                >
                    <v-btn value="horizontal" variant="text" size="small">
                        水平
                    </v-btn>
                    <v-btn value="vertical" variant="text" size="small">
                        垂直
                    </v-btn>
                </v-btn-toggle>
            </div>
            <div class="d-flex align-center">
                <div class="text-subtitle-2">粗细：</div>
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
            </div>
            <div class="d-flex align-center">
                <div class="text-subtitle-2">颜色：</div>
                <v-sheet
                    width="24"
                    height="24"
                    class="border rounded ma-2 ml-0"
                    :color="instance.config.color"
                    style="cursor: pointer"
                >
                    <v-menu activator="parent">
                        <v-color-picker
                            v-model="instance.config.color"
                            show-swatches
                        ></v-color-picker>
                    </v-menu>
                </v-sheet>
            </div>
            <div class="d-flex align-center">
                <div class="text-subtitle-2">样式：</div>
                <v-btn-toggle
                    v-model="instance.config.style"
                    color="primary"
                    class="border"
                    style="height: 36px"
                    divided
                >
                    <v-btn value="solid" variant="text" size="small">
                        <div
                            style="
                                width: 40px;
                                height: 0;
                                border-top: 2px solid black;
                            "
                        ></div>
                    </v-btn>
                    <v-btn value="dotted" variant="text" size="small">
                        <div
                            style="
                                width: 40px;
                                height: 0;
                                border-top: 2px dotted black;
                            "
                        ></div>
                    </v-btn>
                    <v-btn value="dashed" variant="text" size="small">
                        <div
                            style="
                                width: 40px;
                                height: 0;
                                border-top: 2px dashed black;
                            "
                        ></div>
                    </v-btn>
                </v-btn-toggle>
            </div>
        </template>
    </MaterialConfigPopover>
</template>

<script lang="ts">
import { defineComponent, inject, toRefs, watch } from 'vue';
import { ProtoInfo } from './prototypes';
import { M_DIVIDER_NAME } from './config';
import MaterialConfigPopover from '../core/MaterialConfigPopover.vue';
import { Material } from '../../classes/Material';
import { useMaterial } from '../../composables/useApp';

interface MDividerConfig {
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
    components: { MaterialConfigPopover },
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
        // 根据网格调整宽高
        watch(
            () => ({ cellSize: instance.cellSize }),
            () => {
                if (instance.config.direction === 'horizontal') {
                    instance.h = instance.cellSize * 2;
                } else {
                    instance.w = instance.cellSize * 2;
                }
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
