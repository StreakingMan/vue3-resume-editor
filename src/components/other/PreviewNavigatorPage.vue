<script setup lang="ts">
import Paper from '@/components/core/Paper.vue';
import { userPaperShowPageNum } from '@/composables/usePaper';

const props = defineProps<{
    pageNum: number;
}>();

userPaperShowPageNum(props.pageNum);
</script>

<template>
    <Paper />
</template>
