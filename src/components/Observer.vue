<template>
    <div class="observer ma-6">
        实时数据
        <pre>{{ JSON.stringify(items, null, 4) }}</pre>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';

export default defineComponent({
    name: 'Observer',
    setup() {
        const items = ref(inject('items'));
        return {
            items,
        };
    },
});
</script>

<style lang="scss" scoped>
.observer {
    width: 300px;
}
</style>
