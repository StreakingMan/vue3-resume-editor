<template>
    <div>MText</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Material, MaterialOptions } from '../../classes/Material';
import { ProtoInfo } from './prototypes';

const name = 'MText';
export default defineComponent({
    name,
    props: {
        config: {
            type: Object,
            default: () => ({}),
        },
    },
    protoInfo: {
        label: '文本',
        icon: 'text-box-outline',
        creator({ x, y }: Partial<MaterialOptions>): Material {
            return new Material({
                x,
                y,
                config: {
                    componentName: name,
                },
            });
        },
    } as ProtoInfo,
    emits: ['update:config'],
});
</script>

<style scoped lang="scss">
//
</style>