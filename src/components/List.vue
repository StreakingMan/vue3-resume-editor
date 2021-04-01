<template>
    <div class="list">
        <li
            v-for="item in items"
            :key="item.id"
            class="item"
        >
            {{ item.id }}:{{ item.groupName }}
        </li>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';

export default defineComponent({
    name: 'List',
    setup() {
        const items = ref(inject('items'));
        return {
            items,
        };
    },
});
</script>

<style lang="scss" scoped>
.list {
    width: 300px;
}
</style>
