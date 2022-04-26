<template>
    <v-img :src="instance.config.url" @mousedown.stop></v-img>

    <MaterialConfigPopover>
        <template #activator>
            <slot name="activator"></slot>
        </template>
    </MaterialConfigPopover>
</template>

<script lang="ts">
import { defineComponent, inject, nextTick, watch } from 'vue';
import { Material } from '../../classes/Material';
import { ProtoInfo } from './prototypes';
import MaterialConfigPopover from '../core/MaterialConfigPopover.vue';
import { M_IMAGE_NAME } from './config';

interface MImageConfig {
    url: string;
}
export default defineComponent({
    name: M_IMAGE_NAME,
    components: { MaterialConfigPopover },
    protoInfo: {
        label: '图像',
        icon: 'image',
        dragHandlers: ['br'],
        creator({ x, y }) {
            return new Material({
                x,
                y,
                config: {
                    componentName: M_IMAGE_NAME,
                    url: 'https://picsum.photos/500/300',
                },
            });
        },
    } as ProtoInfo,
    setup() {
        const instance: Material<MImageConfig> = inject('m-instance', {
            config: {},
        }) as Material<MImageConfig>;

        watch(instance, async () => {
            await nextTick();
            // 自适应内容高度
            instance.h = (instance.w * 3) / 5;
        });

        return {
            instance,
        };
    },
});
</script>

<style scoped lang="scss">
//
</style>
