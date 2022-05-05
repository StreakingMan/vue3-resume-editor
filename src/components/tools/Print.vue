<template>
    <v-btn icon @click="onPrintClick">
        <v-icon>mdi-printer</v-icon>
        <v-tooltip activator="parent" anchor="bottom"> 打印 </v-tooltip>
    </v-btn>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue';
import { useRuntime } from '../../composables/useApp';

export default defineComponent({
    name: 'Print',
    setup() {
        const runtime = useRuntime();

        const onPrintClick = async () => {
            // 前置工作
            runtime.drawer = false;
            runtime.activeMaterialSet.clear();
            // 打印
            // 等待蒙层消失，这里貌似无法感知，先用setTimeout
            setTimeout(() => {
                window.print();
            }, 1000);
        };

        return {
            onPrintClick,
        };
    },
});
</script>

<style scoped lang="scss">
@page {
    size: a4;
    margin: 0;
}
</style>
