<script setup lang="ts">
import { onMounted } from 'vue';
import { usePaper, useRuntime } from '@/composables/useApp';

const runtime = useRuntime();
const paper = usePaper();

const save = () => {
    paper.saveToStorage();
    runtime.snackbar.text = '已保存';
    runtime.snackbar.show = true;
};

onMounted(() => {
    window.addEventListener('beforeunload', (e) => {
        if (paper.isNeedSave()) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
});
</script>

<template>
    <v-btn icon @click="save">
        <v-icon>mdi-content-save</v-icon>
    </v-btn>
</template>
