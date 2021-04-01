<template>
    <div class="list ma-6">
        <div v-for="(item, index) in items" :key="item.id">
            <div
                v-if="!items[index - 1]?.groupName.startsWith(item.groupName)"
                class="item"
            >
                分组
            </div>
            <div
                class="item"
                :style="{
                    marginLeft: item.groupName.split('.').length * 24 + 'px',
                }"
            >
                {{ item.id }}:{{ item.groupName }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import { Item } from '../interface/Item';

export default defineComponent({
    name: 'List',
    setup() {
        const items = ref<Item[]>(inject('items', []));

        return {
            items,
        };
    },
});
</script>

<style lang="scss" scoped>
.list {
    width: 300px;
    .item {
        margin: 4px;
        padding: 4px;
        border-radius: 2px;
        border: 1px solid grey;
        user-select: none;
    }
}
</style>
