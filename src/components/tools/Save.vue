<template>
    <v-btn icon @click="save">
        <v-icon>mdi-content-save</v-icon>
        <v-tooltip activator="parent" anchor="bottom">缓存到浏览器</v-tooltip>
    </v-btn>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, Ref } from 'vue';
import { UnwrapNestedRefs } from '@vue/reactivity';
import { Paper } from '../../classes/Paper';

export default defineComponent({
    name: 'Save',
    setup() {
        // Paper实例注入
        const paperInstance: UnwrapNestedRefs<Paper> = inject(
            'paper'
        ) as UnwrapNestedRefs<Paper>;

        const snackbar = inject('snackbar') as Ref<boolean>;
        const snackbarText = inject('snackbar:text') as Ref<string>;

        const save = () => {
            paperInstance.saveToStorage();
            snackbarText.value = '已保存';
            snackbar.value = true;
        };

        onMounted(() => {
            window.addEventListener('beforeunload', (e) => {
                if (paperInstance.isNeedSave()) {
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
