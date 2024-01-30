<script setup lang="ts">
import Paper from '@/components/core/Paper.vue';
import { onMounted, provide, reactive } from 'vue';
import { Paper as PaperClass } from '@/classes/Paper';

import { useWindowScroll, useWindowSize } from '@vueuse/core';
import { linear } from '@/utils/timeFunction';
import { paperInjectionKey } from '@/composables/usePaper';

// Paper实例
const paperInstance = reactive(new PaperClass({}));
provide(paperInjectionKey, paperInstance);

const { y } = useWindowScroll({
    behavior: 'instant',
});
const { height } = useWindowSize();

onMounted(async () => {
    if (!paperInstance.loadFromStorage()) {
        window.alert('没有找到存储的数据');
    } else {
        // 临时处理，滚动到底部再打印，后续考虑是否需要优化
        const scrollHeight = paperInstance.h * paperInstance.pageCount - height.value;
        if (scrollHeight < 0) {
            window.print();
            return;
        }
        const duration = (scrollHeight / 1000) * 1000;
        linear({
            start: 0,
            end: scrollHeight,
            duration,
            callback: (value, finished) => {
                y.value = value;
                if (finished) {
                    window.print();
                }
            },
        });
    }
});
</script>

<template>
    <Paper />
</template>
