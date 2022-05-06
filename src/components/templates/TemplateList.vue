<template>
    <div
        class="d-flex align-center justify-start w-100 h-100 overflow-x-auto px-10"
        style="gap: 24px"
    >
        <TemplatePreviewCard
            v-for="(temp, idx) in templateList"
            :key="idx"
            :template="temp"
        />
    </div>
</template>

<script lang="ts">
import template1 from './resume-template-1.json';
import template2 from './resume-template-2.json';
import { defineComponent } from 'vue';
import TemplatePreviewCard from './TemplatePreviewCard.vue';

export default defineComponent({
    name: 'TemplateList',
    components: { TemplatePreviewCard },
    data: () => ({
        templateList: [template1, template2],
    }),
});
</script>
