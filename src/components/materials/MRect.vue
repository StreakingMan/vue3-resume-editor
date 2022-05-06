<template>
    <MaterialConfigPopover v-if="clicked">
        <template #activator>
            <slot name="activator"></slot>
        </template>
        <template #config> </template>
    </MaterialConfigPopover>
</template>

<script lang="ts">
import {defineComponent, toRef} from 'vue';
import { MaterialBaseConfig } from '../../classes/Material';
import { ProtoInfo } from './prototypes';
import { M_RECT_NAME } from './config';
import MaterialConfigPopover from '../core/MaterialConfigPopover.vue';
import {useMaterial} from "../../composables/useApp";

const protoInfo: ProtoInfo<MaterialBaseConfig> = {
    label: '矩形',
    icon: 'vector-square',
    dragHandlers: ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'],
    genInitOptions: ({ x, y }) => ({
        x: x - 100,
        y: y - 100,
        w: 200,
        h: 200,
        componentName: M_RECT_NAME,
        config: {
            backgroundColor: 'rgba(128,128,128)',
        },
    }),
};

export default defineComponent({
    name: M_RECT_NAME,
    components: { MaterialConfigPopover },
    protoInfo,
    setup() {
        const material = useMaterial<MaterialBaseConfig>();
        const { instance } = material;

        return {
            instance,
            clicked: toRef(material, 'clicked'),
        };
    },
});
</script>
