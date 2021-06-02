<template>
    <div
        :style="{
            padding: instance.config.padding + 'px',
            borderStyle: instance.config.borderStyle,
            borderWidth: instance.config.borderWidth + 'px',
            borderColor: instance.config.borderColor,
            borderRadius: instance.config.borderRadius + 'px',
            backgroundColor: instance.config.backgroundColor,
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
                },
            });
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
//
</style>
