<template>
    <div>MTitle</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Material, MaterialOptions } from '../../classes/Material';
import { ProtoInfo } from './prototypes';

const name = 'MTitle';

export default defineComponent({
    name,
    props: {
        config: {
            type: Object,
            default: () => ({}),
        },
    },
    protoInfo: {
        label: '标题',
        icon: 'format-title',
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
    setup() {
        console.log('123');
    },
});
</script>

<style scoped lang="scss">
//
</style>
