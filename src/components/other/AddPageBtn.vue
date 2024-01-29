<script setup lang="ts">
import { usePaper } from '@/composables/useApp';
import { useRuntime } from '@/composables/useRuntime';

const paper = usePaper();
const runtime = useRuntime();
</script>

<template>
    <v-btn
        size="x-large"
        class="mt-4 text-white print-none add-page-btn"
        variant="tonal"
        color="#4f545c"
        prepend-icon="mdi-plus"
        :style="{
            transform: `translateX(-50%) scale(${1 / runtime.scale.value})`,
        }"
        @click.stop="paper.pageCount++"
    >
        新增页面
    </v-btn>
</template>

<style scoped lang="scss">
.add-page-btn {
    transform-origin: center top;
    left: 50%;
    bottom: -80px;
    position: absolute;
}
</style>
