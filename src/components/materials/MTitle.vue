<template>
    <div>{{ config.content }}</div>
    <ConfigPanel>
        <p>字号</p>
        <p>字重</p>
        <p>颜色</p>
    </ConfigPanel>
</template>

<script lang="ts">
import { defineComponent, inject, ref, Ref } from 'vue';
import { Material, MaterialOptions } from '../../classes/Material';
import { ProtoInfo } from './prototypes';
import ConfigPanel from './ConfigPanel.vue';

const name = 'MTitle';

export default defineComponent({
    name,
    components: { ConfigPanel },
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
