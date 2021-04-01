<template>
    <div class="paper a4 ma-6">
        <div
            v-for="item in reverseItems"
            :key="item.id"
            class="item"
            :style="{ left: item.x + 'px', top: item.y + 'px' }"
            @mousedown="onMousedown($event, item)"
            @mouseup="onMouseup($event, item)"
        >
            {{ item.id }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, computed } from 'vue';
import { Item } from '../interface/Item';

export default defineComponent({
    name: 'Paper',
    setup() {
        const items = ref<Item[]>(inject('items', []));
        const reverseItems = computed(() => items.value.slice().reverse());

        const posInfo = {
            mouseStartX: 0,
            mouseStartY: 0,
            itemStartX: 0,
            itemStartY: 0,
        };

        let click = false,
            clickingItem: Item;

        const onMousemove = (evt: MouseEvent) => {
            if (!click) return;
            const { clientX, clientY } = evt;
            const transX = clientX - posInfo.mouseStartX;
            const transY = clientY - posInfo.mouseStartY;
            clickingItem.x = posInfo.itemStartX + transX;
            clickingItem.y = posInfo.itemStartY + transY;
        };
        const onMousedown = (evt: MouseEvent, item: Item) => {
            click = true;
            const { clientX, clientY } = evt;
            const { x, y } = item;
            posInfo.mouseStartX = clientX;
            posInfo.mouseStartY = clientY;
            posInfo.itemStartX = x;
            posInfo.itemStartY = y;
            clickingItem = item;
            window.addEventListener('mousemove', onMousemove);
        };
        const onMouseup = () => {
            click = false;
            window.removeEventListener('mousemove', onMousemove);
        };

        return {
            reverseItems,
            onMousedown,
            onMouseup,
        };
    },
});
</script>

<style lang="scss" scoped>
.paper {
    box-shadow: 0 2px 8px 0 rgb(0 0 0 / 10%);
    border-radius: 2px;
    border: 1px solid #dbdbdb;
    position: relative;
    &.a4 {
        width: 620px;
        height: 877px;
    }
}

.item {
    width: 100px;
    height: 100px;
    border: 1px solid gray;
    border-radius: 2px;
    position: absolute;
    user-select: none;
    background: lightgray;
}
</style>
