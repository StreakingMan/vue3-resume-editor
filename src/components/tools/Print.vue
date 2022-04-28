<template>
    <v-btn icon @click="onPrintClick">
        <v-icon>mdi-printer</v-icon>
    </v-btn>
</template>

<script lang="ts">
import { defineComponent, inject, Ref } from 'vue';
import { UnwrapNestedRefs } from '@vue/reactivity';
import { Paper } from '../../classes/Paper';

export default defineComponent({
    name: 'Print',
    setup() {
        // Paper实例注入
        const paperInstance: UnwrapNestedRefs<Paper> = inject(
            'paper'
        ) as UnwrapNestedRefs<Paper>;

        const showGrid = inject('showGrid') as Ref<boolean>;

        const onPrintClick = () => {
            // 前置工作
            showGrid.value = false;
            // 打印
        };

        return {
            onPrintClick,
        };
    },
});
</script>

<style scoped lang="scss">
//
</style>
