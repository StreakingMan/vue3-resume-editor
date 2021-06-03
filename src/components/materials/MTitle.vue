<template>
    <div
        class="m-title"
        :style="{
            fontSize: instance.config.fontSize + 'px',
        }"
    >
        {{ instance.config.content }}
    </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, Ref, watch } from 'vue';
import { Material, MaterialOptions } from '../../classes/Material';
import { ProtoInfo } from './prototypes';
const name = 'MTitle';

export default defineComponent({
    name,
    protoInfo: {
        label: '标题',
        icon: 'format-title',
        creator({ x, y }: Partial<MaterialOptions>): Material {
            return new Material({
                x: x - 100,
                y: y - 50,
                w: 200,
                h: 100,
                config: {
                    componentName: name,
                    content: 'Material Title',
                    fontSize: 18,
                },
            });
        },
        configOptions: {
            content: {
                type: 'text',
            },
            fontSize: {
                type: 'number',
                min: 12,
                max: 100,
            },
        },
    } as ProtoInfo,
    emits: ['update:config'],
    setup() {
        const instance: Material = inject('instance', {});
        watch(instance, (v) => {
            //console.log(v);
        });

        return {
            instance,
        };
    },
});
</script>

<style scoped lang="scss">
.m-title {
    height: 100%;
    white-space: pre-wrap;
}
</style>
