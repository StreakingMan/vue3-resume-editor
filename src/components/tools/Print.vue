<template>
    <v-btn icon @click="onPrintClick">
        <v-icon>mdi-printer</v-icon>
    </v-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRuntime } from '../../composables/useApp';

export default defineComponent({
    name: 'Print',
    setup() {
        const runtime = useRuntime();

        const onPrintClick = () => {
            // 前置工作
            runtime.showGrid = false;
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
