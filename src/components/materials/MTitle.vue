<template>
    <div>{{ config.content }}</div>
</template>

<script lang="ts">
import { defineComponent, inject, Ref } from 'vue';
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
                    content: '123',
                },
            });
        },
    } as ProtoInfo,
    emits: ['update:config'],
    setup() {
        const instance: Ref = inject('instance', {});
        console.log(instance);

        return {
            config: instance.value.config,
        };
    },
});
</script>

<style scoped lang="scss">
//
</style>
