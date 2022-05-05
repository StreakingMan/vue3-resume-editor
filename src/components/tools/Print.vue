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
            runtime.showGrid = false;
            runtime.activeMaterialSet.clear();
            runtime.scale.value = 1;
            await nextTick();
            if (runtime.sketch.wrapperDiv) {
                runtime.sketch.wrapperDiv.scrollLeft = runtime.sketch.paddingX;
                runtime.sketch.wrapperDiv.scrollTop = runtime.sketch.paddingY;
            }
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
//
</style>
