<template>
    <div ref="paper" class="paper a4">
        <MaterialInstance
            v-for="(item, i) in reverseItems"
            :key="item.id"
            v-model:item="reverseItems[i]"
        ></MaterialInstance>
        <div
            v-if="selecting && !space"
            class="select-box"
            :style="selectorStyle"
        ></div>
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
import { Item } from '../../interface/Item';
import { MouseEvtInfo } from '../../interface/mouseEvtCb';
import useMouseDrag from '../../composables/useMouseDrag';
import useKeyboardStatus from '../../composables/useKeyboardStatus';
import MaterialInstance from './MaterialInstance.vue';

export default defineComponent({
    name: 'Paper',
    components: { MaterialInstance },
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

        const { space } = useKeyboardStatus();

        return {
            space,
            paper,
            selecting,
            selectorStyle,
            reverseItems,
        };
    },
    computed: {
        guideState() {
            return this.$store.state.guideState;
        },
        scale() {
            return this.$store.state.scale;
        },
        paperSize() {
            return this.$store.state.paperSize;
        },
    },
});
</script>

<style lang="scss" scoped>
.paper {
    position: relative;
    background-color: white;
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
