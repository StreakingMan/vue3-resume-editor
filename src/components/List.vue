<template>
    <div class="list ma-6">
        <div v-for="(item, index) in items" :key="item.id">
            <template v-if="calcVirtualGroups(items[index - 1], item).length">
                <div
                    v-for="(group, idx) in calcVirtualGroups(
                        items[index - 1],
                        item
                    )"
                    :key="group"
                    class="group"
                    :style="{
                        marginLeft:
                            item.groupName.split('.').length * 24 -
                            (calcVirtualGroups(items[index - 1], item).length -
                                idx) *
                                24 +
                            'px',
                    }"
                >
                    {{ group }}
                </div>
            </template>

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
import { getGroupsByGroupNameDiff } from '../algorithms/group';

export default defineComponent({
    name: 'List',
    setup() {
        const items = ref<Item[]>(inject('items', []));

        // TODO 包装到computed中
        const calcVirtualGroups = (preItem: Item, curItem: Item) => {
            return getGroupsByGroupNameDiff(
                preItem?.groupName || '',
                curItem.groupName
            );
        };

        return {
            items,
            calcVirtualGroups,
        };
    },
});
</script>

<style lang="scss" scoped>
.list {
    width: 300px;
    .item,
    .group {
        margin: 4px;
        padding: 4px;
        border-radius: 2px;
        border: 1px solid grey;
        user-select: none;
    }
    .group {
        background-color: lightblue;
    }
}
</style>
