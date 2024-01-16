<template>
    <v-btn icon @click="save">
        <v-icon>mdi-content-save</v-icon>
    </v-btn>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { usePaper, useRuntime } from '../../composables/useApp';

export default defineComponent({
    name: 'Save',
    setup() {
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

        return {
            save,
        };
    },
});
</script>
