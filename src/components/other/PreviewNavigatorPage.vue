<script setup lang="ts">
import Paper from '@/components/core/Paper.vue';
import { provide } from 'vue';

import { paperShowPageNumInjectionKey } from '@/composables/usePaper';

const props = defineProps<{
    pageNum: number;
}>();

provide(paperShowPageNumInjectionKey, props.pageNum);
</script>

<template>
    <Paper />
</template>
