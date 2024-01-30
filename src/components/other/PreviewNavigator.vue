<script setup lang="ts">
import PreviewNavigatorPage from '@/components/other/PreviewNavigatorPage.vue';
import { computed, provide, ref, watch } from 'vue';
import { PaperMode } from '@/classes/Paper';
import { vElementHover } from '@vueuse/components';
import { useRuntime } from '@/composables/useRuntime';
import { paperModeInjectionKey, usePaper } from '@/composables/usePaper';

const runtime = useRuntime();
const paperInstance = usePaper();
provide(paperModeInjectionKey, PaperMode.Preview);

const show = ref(true);

// 点击预览页滚动到对应页
const onPreviewClick = (pageNum: number) => {
    const pageEl = document.getElementById(`paper-page-${pageNum}`);
    if (!pageEl) return;
    pageEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
};

// 根据位置计算正在浏览的页码
const viewingPageNum = ref(1);
watch(
    () => runtime.paper.bounds.y,
    (v) => {
        if (v > 0) return 1;
        const halfPageH = runtime.paper.bounds.height / paperInstance.pageCount / 2;
        viewingPageNum.value = Math.ceil(Math.floor(-v / halfPageH) / 2) + 1;
    },
);

const hoveringPageNum = ref<number | null>(null);

const transformList = computed(() => {
    if (!show.value) {
        return {
            degList: new Array(8)
                .fill(0)
                .map((_, i) => -i * 4)
                .reverse(),
            translateList: new Array(8).fill(0),
        };
    }
    let totalDeg = 8 * paperInstance.pageCount;
    const unitDeg = Math.floor(totalDeg / paperInstance.pageCount);
    const degList = [];
    const translateList = [];
    let startDeg = -5;
    let startTranslate = 0;
    for (let i = paperInstance.pageCount; i >= 1; i--) {
        degList.unshift(startDeg);
        startDeg -= unitDeg;
        translateList.unshift(startTranslate);
        if (i === viewingPageNum.value) {
            startDeg -= 30;
            startTranslate += 80;
        } else if (hoveringPageNum.value && i === hoveringPageNum.value) {
            startDeg -= 15;
            startTranslate += 20;
        }
    }
    return { degList, translateList };
});
</script>

<template>
    <div
        class="container print-none"
        :style="{
            transform: show ? 'translateX(0)' : 'translateX(180px)',
        }"
    >
        <div
            v-for="(num, idx) in paperInstance.pageCount"
            :key="idx"
            v-element-hover="(state) => (hoveringPageNum = state ? num : null)"
            class="page-wrapper elevation-4"
            :class="{
                'danger-shadow': runtime.paper.hoveringDeletePageNum === num,
            }"
            :style="{
                zIndex: paperInstance.pageCount - idx,
                opacity: hoveringPageNum && num !== hoveringPageNum ? 0.5 : 1,
                transform: `
                translateY(${transformList.translateList[idx]}px)
                rotate(${transformList.degList[idx]}deg)
                ${num === hoveringPageNum ? 'translateY(-20px)' : ''}
                ${num === viewingPageNum ? 'translateY(-20px)' : ''}
                `,
            }"
            @click="onPreviewClick(num)"
        >
            <v-sheet
                class="position-relative"
                width="145"
                :height="145 * (paperInstance.h / paperInstance.w)"
            >
                <v-sheet
                    class="preview"
                    :width="paperInstance.w"
                    :height="paperInstance.h"
                    :style="{
                        transform: `scale(${145 / paperInstance.w})`,
                    }"
                >
                    <PreviewNavigatorPage :page-num="num" />
                </v-sheet>
            </v-sheet>
        </div>
    </div>

    <v-btn
        class="toggle-btn position-fixed print-none"
        size="x-large"
        icon
        style="right: 24px; top: 300px"
        :style="{
            transform: show ? 'translateX(0)' : 'translateX(24px)',
        }"
        @click="show = !show"
    >
        <v-icon>
            {{ show ? 'mdi-rotate-right' : 'mdi-rotate-left' }}
        </v-icon>
    </v-btn>
</template>

<style scoped lang="scss">
.container {
    position: fixed;
    top: 120px;
    right: 16px;
    transition: transform 0.3s;
}

.page-wrapper {
    border-radius: 4px;
    overflow: hidden;
    transition:
        opacity 0.2s,
        box-shadow 0.4s,
        transform 0.3s;
    cursor: pointer;
    transform-origin: center bottom;
    position: absolute;
    right: 0;

    &.danger-shadow {
        box-shadow: 0 0 0 4px #f44336 !important;
    }
}

.preview {
    transform-origin: top left;
    overflow: hidden;
}
</style>
