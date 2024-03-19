<script setup lang="ts">
import Paper from '@/components/core/Paper.vue';
import { onMounted } from 'vue';

import { useWindowScroll, useWindowSize, useTitle, useDateFormat, useNow } from '@vueuse/core';
import { linear } from '@/utils/timeFunction';
import { createAndProvideReactivePaper, usePaperMode } from '@/composables/usePaper';
import { PaperMode } from '@/classes/Paper';

// 更改标题格式为：resume-2021/8/1-12:00:00
useTitle().value = `resume-${useDateFormat(useNow(), 'YYYY/M/D-H:m:s').value}`;

// Paper实例
const paperInstance = createAndProvideReactivePaper();

usePaperMode(PaperMode.Preview);

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
        const duration = (scrollHeight / 1000) * 2000;
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
