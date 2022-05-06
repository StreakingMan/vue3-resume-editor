<template>
    <div
        :style="{
            transform,
        }"
        class="template-preview--wrapper"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
    >
        <div
            class="template-preview--card"
            :style="{ backgroundColor: paper.background }"
        >
            <div
                v-for="m in paper.materialList.filter(
                    (m) => m.componentName !== 'MDivider'
                )"
                :key="m.id"
                :style="{
                    background:
                        m?.config?.backgroundColor || 'rgba(128,128,128,0.3)',
                    borderRadius: (m?.config?.borderRadius || 0) + 'px',
                    position: 'absolute',
                    left: m.x + 'px',
                    top: m.y + 'px',
                    width: m.w + 'px',
                    height: m.h + 'px',
                }"
            ></div>
        </div>
        <v-btn class="btn" color="primary" elevation="8" @click="onClick">
            使用模板
        </v-btn>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { Paper } from '../../classes/Paper';
import { usePaper, useRuntime } from '../../composables/useApp';

export default defineComponent({
    name: 'TemplatePreviewCard',
    props: {
        template: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        const matrix = ref<number[][]>([]);
        const handleMouseMove = (e: MouseEvent) => {
            const { offsetX, offsetY, target } = e;
            const x = offsetX - (target as HTMLElement).offsetWidth / 2;
            const y = offsetY - (target as HTMLElement).offsetHeight / 2;
            matrix.value = [
                [1, 0, 0, x * 0.000005],
                [0, 1, 0, y * 0.000005],
                [0, 0, 1, 1],
                [0, 0, 0, 1],
            ];
        };
        const handleMouseLeave = () => {
            matrix.value = [
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1],
            ];
        };

        const transform = computed(() => {
            return `matrix3d(${matrix.value.toString()})`;
        });

        const paper = new Paper({});
        paper.loadData(props.template as any);

        const runtime = useRuntime();
        const realPaper = usePaper();

        const onClick = () => {
            const res = window.confirm('模板将覆盖当前页面，确认使用？');
            if (res) {
                realPaper.loadData(props.template as any);
                runtime.bottomDrawer = false;
            }
        };

        return {
            onClick,
            paper,
            transform,
            handleMouseMove,
            handleMouseLeave,
        };
    },
});
</script>

<style scoped lang="scss">
.btn {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    transition: 0.3s;
    opacity: 0;
}
.template-preview {
    &--card {
        width: 793px;
        height: 1122px;
        border: 1px solid white;
        border-radius: 4px;
        zoom: 0.18;
        position: relative;
        pointer-events: none;
        transition: 0.3s;
        overflow: hidden;
    }

    &--wrapper {
        position: relative;
        &:hover {
            .btn {
                opacity: 0.7;
            }
            .template-preview--card {
                transform: translateY(-100px);
            }
        }
    }
}
</style>
