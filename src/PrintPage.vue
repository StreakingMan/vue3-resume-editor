<script setup lang="ts">
import Paper from '@/components/core/Paper.vue';
import { onMounted, provide, reactive } from 'vue';
import { Paper as PaperClass, paperInjectionKey } from '@/classes/Paper';

// Paper实例
const paperInstance = reactive(new PaperClass({}));
provide(paperInjectionKey, paperInstance);
onMounted(() => {
    if (!paperInstance.loadFromStorage()) {
        window.alert('没有找到存储的数据');
    } else {
        console.log(paperInstance);
        // document.body.style.background = paperInstance.background;
        window.print();
    }
});
</script>

<template>
    <Paper />
</template>
