<template>
    <div class="select-box" :style="style"></div>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    inject,
    onMounted,
    onUnmounted,
    watch,
    ref,
} from 'vue';
import { Item } from '../interface/Item';
import { MouseEvtInfo } from '../interface/mouseEvtCb';
import useMouseDrag from '../composables/useMouseDrag';

export default defineComponent({
    name: 'Selector',
    setup() {
        const items = ref<Item[]>(inject('items', []));
        const paper = ref<HTMLElement>(
            inject('paper', document.createElement('div'))
        );
        const posInfo = ref({
            paperX: 0,
            paperY: 0,
            startX: 0,
            startY: 0,
            transX: 0,
            transY: 0,
        });

        const onStart = (info: MouseEvtInfo) => {
            const { clientX, clientY } = info;
            const { x, y } = paper.value.getBoundingClientRect();
            posInfo.value.startX = clientX;
            posInfo.value.startY = clientY;
            posInfo.value.paperX = x;
            posInfo.value.paperY = y;
        };

        const onDrag = (info: MouseEvtInfo) => {
            const { clientX, clientY } = info;
            const { startX, startY } = posInfo.value;

            posInfo.value.transX = clientX - startX;
            posInfo.value.transY = clientY - startY;
        };

        const onFinish = (info: MouseEvtInfo) => {
            console.log(info);
        };

        const {
            onMousedown,
            onMousemove,
            onMouseup,
            onMouseleave,
        } = useMouseDrag(onStart, onDrag, onFinish);

        /*onMounted(() => {
            paper.value.addEventListener('mousedown', onMousedown);
            paper.value.addEventListener('mousemove', onMousemove);
            paper.value.addEventListener('mouseup', onMouseup);
            paper.value.addEventListener('mouseleave', onMouseleave);
        });

        onUnmounted(() => {
            paper.value.removeEventListener('mousedown', onMousedown);
            paper.value.removeEventListener('mousemove', onMousemove);
            paper.value.removeEventListener('mouseup', onMouseup);
            paper.value.removeEventListener('mouseleave', onMouseleave);
        });*/

        console.log(paper);
        watch(paper.value, (v) => {
            console.log(v);
        });

        // TODO scale
        const style = computed(() => {
            let left = posInfo.value.startX - posInfo.value.paperX,
                top = posInfo.value.startY - posInfo.value.paperY,
                width = posInfo.value.transX,
                height = posInfo.value.startY;
            if (width < 0) width = -width;
            left = left - width;
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

        return { style };
    },
});
</script>

<style lang="scss" scoped>
.select-box {
    position: absolute;
    border: lightcoral;
    background: lightblue;
    opacity: 0.3;
    z-index: 9;
}
</style>
