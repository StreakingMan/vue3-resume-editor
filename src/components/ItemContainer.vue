<template>
    <div
        :key="selfItem.id"
        class="item"
        :style="{ left: selfItem.x + 'px', top: selfItem.y + 'px' }"
        @mousedown="onMousedown($event)"
        @mouseup="onMouseup($event)"
    >
        {{ selfItem.id }}
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
import { Item } from '../interface/Item';

export default defineComponent({
    name: 'ItemContainer',
    props: {
        item: {
            type: Object,
            default: null,
            require: true,
        },
    },
    emits: ['update:item'],
    setup(props, { emit }) {
        const posInfo = {
            mouseStartX: 0,
            mouseStartY: 0,
            itemStartX: 0,
            itemStartY: 0,
        };

        const { item } = toRefs(props);
        const selfItem = computed({
            get: () => item.value,
            set: (v) => emit('update:item', v),
        });

        let clicking = false;

        const onMousedown = (evt: MouseEvent) => {
            evt.stopPropagation();
            clicking = true;
            const { clientX, clientY } = evt;
            const { x, y } = selfItem.value;
            posInfo.mouseStartX = clientX;
            posInfo.mouseStartY = clientY;
            posInfo.itemStartX = x;
            posInfo.itemStartY = y;
            window.addEventListener('mousemove', onMousemove);
        };
        const onMousemove = (evt: MouseEvent) => {
            if (!clicking) return;
            const { clientX, clientY } = evt;
            const transX = clientX - posInfo.mouseStartX;
            const transY = clientY - posInfo.mouseStartY;
            selfItem.value.x = posInfo.itemStartX + transX;
            selfItem.value.y = posInfo.itemStartY + transY;
        };
        const onMouseup = () => {
            clicking = false;
            window.removeEventListener('mousemove', onMousemove);
        };
        return {
            onMousedown,
            onMousemove,
            onMouseup,
            selfItem,
        };
    },
});
</script>

<style scoped lang="scss">
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
