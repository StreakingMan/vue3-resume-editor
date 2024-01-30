<script setup lang="ts">
import { reactive, ref } from 'vue';
import useMouseDragDynamic, { type MouseEvtInfo } from '../../composables/useMouseDragDynamic';
import { prototypeMap } from '../materials/prototypes';
import { MaterialNames } from '../materials/config';
import { useRuntime } from '@/composables/useRuntime';
import { usePaper } from '@/composables/usePaper';

const runtime = useRuntime();
const paper = usePaper();

// 原型信息
const prototypes = reactive(prototypeMap);

// 原型拖入paper
const draggingProtoType = ref<MaterialNames>(MaterialNames.MText);
const { onMousedown: onProtoMousedown } = useMouseDragDynamic({
    onStart() {
        //console.log(draggingProtoType.value);
    },
    onDrag({ transX, transY }: MouseEvtInfo) {
        const proto = prototypes[draggingProtoType.value];
        if (!proto) return;
        proto.tempStyle = `transition: 0s;transform: translateX(${transX}px) translateY(${transY}px) !important`;
    },
    onFinish({ currentX, currentY }: MouseEvtInfo) {
        const proto = prototypes[draggingProtoType.value];
        if (!proto) return;
        proto.tempStyle = '';

        // 计算释放时相对于paper的位置
        const { x: paperX, y: paperY } = runtime.paper.bounds;

        const x = (currentX - paperX) / runtime.scale.value;
        const y = (currentY - paperY) / runtime.scale.value;
        if (x < 0 || y < 0) return;
        paper.addMaterial(proto.genInitOptions({ x, y, paperInstance: paper }));
    },
});
</script>

<template>
    <v-row no-gutters class="pa-6">
        <v-col cols="12" class="mb-2">
            <div class="text-subtitle-1">基础元素</div>
        </v-col>
        <v-col v-for="(proto, name) in prototypes" :key="name" cols="4">
            <v-sheet
                class="sheet bg-grey-darken-2 ma-1"
                :style="proto.tempStyle"
                @mousedown.prevent.stop="
                    draggingProtoType = name;
                    onProtoMousedown($event);
                "
            >
                <v-responsive :aspect-ratio="1">
                    <div
                        class="text-caption w-100 h-100 d-flex flex-column justify-center align-center"
                    >
                        <v-icon size="24">mdi-{{ proto.icon }}</v-icon>
                        <span class="mt-1">{{ proto.label }}</span>
                    </div>
                </v-responsive>
            </v-sheet>
        </v-col>
    </v-row>
</template>

<style scoped lang="scss">
.sheet {
    cursor: pointer;
}

.prototype-container {
    position: fixed;
    transition: 0.3s;
    width: 80px;
    height: auto;
    top: 50vh;
    transform: translateY(-50%);
    flex-direction: column;

    &__toggle {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateX(100%) translateY(-50%);
        width: 48px;
        height: 48px;
        border-top-right-radius: 24px;
        border-bottom-right-radius: 24px;
        transition: 0.3s;
        //

        i {
            transition: 0.4s;
        }
    }

    &:hover {
        .prototype-container__toggle {
            //
        }
    }
}
</style>
