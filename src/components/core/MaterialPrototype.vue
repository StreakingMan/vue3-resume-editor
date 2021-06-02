<template>
    <div
        class="prototype-container pa-1 bg-color-white elevation-2 hover-elevation-12 d-flex bdrs-8 align-center justify-center"
        :style="{ left: containerLeft }"
    >
        <MyIconButton
            v-for="(proto, name) in prototypes"
            :key="name"
            :icon="proto.icon"
            :style="proto.tempStyle"
            @mousedown.prevent.stop="
                draggingProtoType = name;
                onProtoMousedown($event);
            "
        >
            {{ proto.label }}
        </MyIconButton>

        <div
            class="prototype-container__toggle bg-color-white cursor-pointer d-flex align-center justify-center"
            @click="containerHidden = !containerHidden"
        >
            <i
                class="mdi mdi-arrow-left-bold color-info fz-18"
                :style="{
                    transform: `rotate(${containerHidden ? 180 : 0}deg)`,
                }"
            ></i>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, reactive, ref, Ref } from 'vue';
import MyIconButton from '../ui/MyIconButton.vue';
import { Paper } from '../../classes/Paper';
import useMouseDrag, { MouseEvtInfo } from '../../composables/useMouseDrag';
import { AppState } from '../../classes/App';
import prototypeMap from '../materials/prototypes';

export default defineComponent({
    name: 'MaterialPrototype',
    components: { MyIconButton },

    setup() {
        const appState: Ref<AppState> = inject('app:state', ref('welcome'));
        const containerHidden = ref(false);
        const containerLeft = computed(() =>
            appState.value === 'welcome'
                ? '-150px'
                : containerHidden.value
                ? '-96px'
                : '16px'
        );

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
            containerLeft,
            containerHidden,
            prototypes,
            onProtoMousedown,
            draggingProtoType,
        };
    },
});
</script>

<style scoped lang="scss">
@import 'src/styles/elevation';
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
        @include elevation(3);

        i {
            transition: 0.4s;
        }
    }

    &:hover {
        .prototype-container__toggle {
            @include elevation(12);
        }
    }
}
</style>
