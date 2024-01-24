<script setup lang="ts">
import template1 from './resume-template-1.json';
import template2 from './resume-template-2.json';
import TemplatePreviewCard from './TemplatePreviewCard.vue';

const templateList = [template1, template2];
</script>

<template>
    <div
        class="d-flex align-center justify-start w-100 h-100 overflow-x-auto px-10"
        style="gap: 24px"
    >
        <TemplatePreviewCard v-for="(temp, idx) in templateList" :key="idx" :template="temp" />
        <a
            class="text-subtitle-1 text-white"
            href="https://github.com/StreakingMan/vue3-resume-editor#%E5%8F%82%E4%B8%8E%E8%B4%A1%E7%8C%AE"
            target="_blank"
            >提交PR 分享你的模板！</a
        >
    </div>
</template>
