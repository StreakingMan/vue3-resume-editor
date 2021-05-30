<template>
    <div
        :key="selfItem.id"
        ref="itemRef"
        class="item"
        :style="{ left: selfItem.x + 'px', top: selfItem.y + 'px' }"
    >
        {{ selfItem.id }}
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, Ref, ref, toRefs } from 'vue';
import useMouseDrag, { MouseEvtInfo } from '../../composables/useMouseDrag';

export default defineComponent({
    name: 'MaterialInstance',
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
            itemStartX: 0,
            itemStartY: 0,
        };

        const { item } = toRefs(props);
        const selfItem = computed({
            get: () => item.value,
            set: (v) => emit('update:item', v),
        });

        // 缩放值注入
        const scale: Ref<number> = inject('scale');

        const itemRef = ref(null);
        useMouseDrag({
            onStart() {
                const { x, y } = selfItem.value;
                posInfo.itemStartX = x;
                posInfo.itemStartY = y;
            },
            onDrag({ transX, transY }: MouseEvtInfo) {
                selfItem.value.x = posInfo.itemStartX + transX / scale.value;
                selfItem.value.y = posInfo.itemStartY + transY / scale.value;
            },
            onFinish() {
                //
            },
            bindElementRef: itemRef,
        });

        return {
            itemRef,
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
