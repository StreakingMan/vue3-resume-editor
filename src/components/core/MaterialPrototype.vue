<template>
    <div
        class="prototype-container pa-1 bg-color-white elevation-2 hover-elevation-12 d-flex bdrs-8 align-center justify-center"
        :style="{ left: containerLeft }"
    >
        <MyIconButton
            ref="Title"
            icon="format-title"
            :style="prototypeInfo.Title.style"
        >
            标题
        </MyIconButton>
        <MyIconButton icon="text-box-outline">文本</MyIconButton>
        <MyIconButton icon="image">图像</MyIconButton>
        <MyIconButton icon="format-list-bulleted-type">列表</MyIconButton>
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
import {
    computed,
    defineComponent,
    inject,
    onMounted,
    reactive,
    ref,
    Ref,
} from 'vue';
import MyIconButton from '../ui/MyIconButton.vue';
import { Paper } from '../../classes/Paper';
import useMouseDrag, { MouseEvtInfo } from '../../composables/useMouseDrag';

export default defineComponent({
    name: 'MaterialPrototype',
    components: { MyIconButton },

    setup() {
        const appState = inject('appState');
        const containerHidden = ref(false);
        const containerLeft = computed(() =>
            appState.value === 'welcome'
                ? '-150px'
                : containerHidden.value
                ? '-96px'
                : '16px'
        );

        // Paper实例注入
        const paperInstance = inject('paper');

        // 原型信息
        const Title = ref(null);
        const prototypeInfo = reactive({
            Title: {
                style: ``,
            },
        });

        useMouseDrag({
            onStart() {
                //
            },
            onDrag({ transX, transY }: MouseEvtInfo) {
                prototypeInfo.Title.style = `transition: 0s;transform: translateX(${transX}px) translateY(${transY}px) !important`;
            },
            onFinish() {
                prototypeInfo.Title.style = ``;
                paperInstance.addMaterial({
                    config: {
                        type: 'Title',
                    },
                });
            },
            bindElementRef: Title,
        });

        return {
            containerLeft,
            containerHidden,
            prototypeInfo,
            Title,
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
        @include elevation(2);

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
