<template>
    <div ref="paper" class="paper a4 ma-6">
        <ItemContainer
            v-for="(item, i) in reverseItems"
            :key="item.id"
            v-model:item="reverseItems[i]"
        ></ItemContainer>
        <div v-if="selecting" class="select-box" :style="selectorStyle"></div>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    inject,
    ref,
    computed,
    onMounted,
    onUnmounted,
} from 'vue';
import { Item } from '../interface/Item';
import ItemContainer from './ItemContainer.vue';
import { MouseEvtInfo } from '../interface/mouseEvtCb';
import useMouseDrag from '../composables/useMouseDrag';

export default defineComponent({
    name: 'Paper',
    components: { ItemContainer },
    setup() {
        const items = ref<Item[]>(inject('items', []));
        const reverseItems = computed(() => items.value.slice().reverse());
        const paper = ref<HTMLDivElement>();
        const selectorInfo = ref({
            paperX: 0,
            paperY: 0,
            startX: 0,
            startY: 0,
            transX: 0,
            transY: 0,
        });

        const onSelectStart = (info: MouseEvtInfo) => {
            if (!paper.value) return;
            const { clientX, clientY } = info;
            const { x, y } = paper.value.getBoundingClientRect();
            selectorInfo.value.startX = clientX;
            selectorInfo.value.startY = clientY;
            selectorInfo.value.paperX = x;
            selectorInfo.value.paperY = y;
        };

        const onSelectDrag = (info: MouseEvtInfo) => {
            const { clientX, clientY } = info;
            const { startX, startY } = selectorInfo.value;

            selectorInfo.value.transX = clientX - startX;
            selectorInfo.value.transY = clientY - startY;
        };

        const onSelectFinish = (info: MouseEvtInfo) => {
            console.log(info);
            selectorInfo.value = {
                paperX: 0,
                paperY: 0,
                startX: 0,
                startY: 0,
                transX: 0,
                transY: 0,
            };
        };

        const {
            clicking: selecting,
            onMousedown,
            onMousemove,
            onMouseup,
            onMouseleave,
        } = useMouseDrag(onSelectStart, onSelectDrag, onSelectFinish);

        onMounted(() => {
            if (!paper.value) return;
            paper.value.addEventListener('mousedown', onMousedown);
            paper.value.addEventListener('mousemove', onMousemove);
            paper.value.addEventListener('mouseup', onMouseup);
            paper.value.addEventListener('mouseleave', onMouseleave);
        });

        onUnmounted(() => {
            if (!paper.value) return;
            paper.value.removeEventListener('mousedown', onMousedown);
            paper.value.removeEventListener('mousemove', onMousemove);
            paper.value.removeEventListener('mouseup', onMouseup);
            paper.value.removeEventListener('mouseleave', onMouseleave);
        });

        // TODO scale
        const selectorStyle = computed(() => {
            let left = selectorInfo.value.startX - selectorInfo.value.paperX,
                top = selectorInfo.value.startY - selectorInfo.value.paperY,
                width = selectorInfo.value.transX,
                height = selectorInfo.value.transY;
            if (width < 0) {
                width = -width;
                left = left - width;
            }
            if (height < 0) {
                height = -height;
                top = top - height;
            }

            return {
                left: left + 'px',
                top: top + 'px',
                width: width + 'px',
                height: height + 'px',
            };
        });

        return {
            paper,
            selecting,
            selectorStyle,
            reverseItems,
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

    .select-box {
        position: absolute;
        border: lightcoral;
        background: lightblue;
        opacity: 0.3;
        z-index: 9;
    }
}
</style>
