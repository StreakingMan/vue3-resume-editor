<template>
    <v-row no-gutters class="pa-6">
        <v-col v-for="(proto, name) in prototypes" :key="name" cols="4">
            <v-sheet
                class="border sheet"
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
                        <span>{{ proto.label }}</span>
                    </div>
                </v-responsive>
            </v-sheet>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { defineComponent, inject, reactive, ref, Ref } from 'vue';
import { Paper } from '../../classes/Paper';
import useMouseDrag, { MouseEvtInfo } from '../../composables/useMouseDrag';
import prototypeMap from '../materials/prototypes';

export default defineComponent({
    name: 'MaterialPrototype',
    components: {},
    setup() {
        // Sketch组件注入
        const sketch: Ref = inject('sketch', ref({}));

        // 缩放值注入
        const scale: Ref<number> = inject('scale', ref(1));

        // Paper实例注入
        const paperInstance: Paper = inject('paper', new Paper({}));

        // 原型信息
        const prototypes: Record<string, any> = reactive(prototypeMap);

        // 原型拖入paper
        const draggingProtoType: Ref<string> = ref('');
        const { onMousedown: onProtoMousedown } = useMouseDrag({
            onStart({ startX, startY }) {
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
                if (!sketch.value) return;
                const { paddingX, paddingY, wrapper } = sketch.value;
                const { scrollLeft, scrollTop } = wrapper;
                const x =
                    (currentX -
                        (paddingX -
                            (paperInstance.w * (scale.value - 1)) / 2 -
                            scrollLeft)) /
                    scale.value;
                const y =
                    (currentY -
                        (paddingY -
                            (paperInstance.h * (scale.value - 1)) / 2 -
                            scrollTop)) /
                    scale.value;
                if (x < 0 || y < 0) return;
                if (!proto.creator) return;
                paperInstance.addMaterial(proto.creator({ x, y }));
            },
        });

        return {
            prototypes,
            onProtoMousedown,
            draggingProtoType,
        };
    },
});
</script>

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
