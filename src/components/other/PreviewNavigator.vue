<script setup lang="ts">
import { usePaper } from '@/composables/useApp';
import PreviewNavigatorPage from '@/components/other/PreviewNavigatorPage.vue';
import { provide } from 'vue';
import { PaperMode, paperModeInjectionKey } from '@/classes/Paper';

const paperInstance = usePaper();
provide(paperModeInjectionKey, PaperMode.Preview);
</script>

<template>
    <div class="container">
        <v-sheet
            v-for="(num, idx) in paperInstance.pageCount"
            :key="idx"
            class="preview"
            :width="paperInstance.w"
            :height="paperInstance.h"
        >
            <PreviewNavigatorPage :page-num="num" />
        </v-sheet>
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

.preview {
    position: relative;
    zoom: 0.18;
    overflow: hidden;
}
</style>
