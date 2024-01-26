<script setup lang="ts">
import { usePaper } from '@/composables/useApp';
import PreviewNavigatorPage from '@/components/other/PreviewNavigatorPage.vue';
import { provide } from 'vue';
import { PaperMode, paperModeInjectionKey } from '@/classes/Paper';

const paperInstance = usePaper();
provide(paperModeInjectionKey, PaperMode.Preview);

// 点击预览页滚动到对应页
const onPreviewClick = (pageNum: number) => {
    const pageEl = document.getElementById(`paper-page-${pageNum}`);
    if (!pageEl) return;
    pageEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
};
</script>

<template>
    <div class="container print-none">
        <div
            v-for="(num, idx) in paperInstance.pageCount"
            :key="idx"
            class="page-wrapper"
            @click="onPreviewClick(num)"
        >
            <v-sheet class="preview" :width="paperInstance.w" :height="paperInstance.h">
                <PreviewNavigatorPage :page-num="num" />
            </v-sheet>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    position: fixed;
    display: flex;
    gap: 4px;
    top: 100px;
    right: 0;
}

.page-wrapper {
    border-radius: 4px;
    overflow: hidden;
    transition: transform 0.3s;
    cursor: pointer;

    &:hover {
        transform: scale(1.05);
    }
}

.preview {
    position: relative;
    zoom: 0.18;
    overflow: hidden;
}
</style>
