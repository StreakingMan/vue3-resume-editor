<template>
    <div class="list ma-6">
        <transition-group name="list-complete">
            <div
                v-for="(item, index) in items"
                :key="item.id"
                class="list-complete-item"
            >
                <ListVirtualGroup
                    :pre-item="items[index - 1]"
                    :cur-item="item"
                ></ListVirtualGroup>

                <div
                    class="item"
                    :style="{
                        marginLeft:
                            item.groupName.split('.').length * 24 + 'px',
                    }"
                    draggable="true"
                    @dragstart="onDragstart($event, item, index)"
                    @dragover="onDragover($event)"
                    @drop="onDrop($event, item, index)"
                >
                    {{ item.id }}:{{ item.groupName }}
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import { Item } from '../interface/Item';
import ListVirtualGroup from './ListVirtualGroup.vue';

export default defineComponent({
    name: 'List',
    components: { ListVirtualGroup },
    setup() {
        const items = ref<Item[]>(inject('items', []));

        const onDragstart = (evt: DragEvent, item: Item, dragIndex: number) => {
            evt.dataTransfer?.setData(
                'text/plain',
                JSON.stringify({ item, dragIndex })
            );
        };

        const onDrop = (evt: DragEvent, item: Item, dropIndex: number) => {
            evt.preventDefault();
            if (!evt.dataTransfer) return;
            try {
                const { dragIndex } = JSON.parse(
                    evt.dataTransfer.getData('text')
                );
                [items.value[dragIndex], items.value[dropIndex]] = [
                    items.value[dropIndex],
                    items.value[dragIndex],
                ];
            } catch (e) {
                console.log(e);
                return;
            }
        };

        const onDragover = (evt: DragEvent) => {
            evt.preventDefault();
        };

        return {
            items,
            onDragstart,
            onDragover,
            onDrop,
        };
    },
});
</script>

<style>
.list-complete-item {
    transition: all 0.3s ease;
    margin-right: 10px;
}

.list-complete-enter-from,
.list-complete-leave-to {
    opacity: 0;
    transform: translateY(30px);
}

.list-complete-leave-active {
    position: absolute;
}
</style>
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
