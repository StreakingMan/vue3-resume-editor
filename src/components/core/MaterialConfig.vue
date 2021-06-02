<template>
    <!-- TODO  拷贝的MaterialPrototype布局，待封装-->
    <div
        class="config-container pa-4 bg-color-white elevation-3 hover-elevation-12 bdrs-8"
        :style="{ right: containerRight }"
    >
        <template v-if="focusMaterial">
            <!--基础配置-->
            <p>padding:</p>
            <MyRangeInput v-model="focusMaterial.config.padding"></MyRangeInput>
            <p>backgroundColor:</p>
            <MyColorPicker
                v-model="focusMaterial.config.backgroundColor"
            ></MyColorPicker>
            <p>borderStyle:</p>
            <MySelect
                v-model="focusMaterial.config.borderStyle"
                :options="[
                    { value: 'none' },
                    { value: 'solid' },
                    { value: 'dashed' },
                ]"
            ></MySelect>
            <template v-if="focusMaterial.config.borderStyle !== 'none'">
                <p>borderWidth:</p>
                <MyRangeInput
                    v-model="focusMaterial.config.borderWidth"
                ></MyRangeInput>
                <p>borderColor:</p>
                <MyColorPicker
                    v-model="focusMaterial.config.borderColor"
                ></MyColorPicker>
                <p>borderRadius:</p>
                <MyRangeInput
                    v-model="focusMaterial.config.borderRadius"
                ></MyRangeInput>
            </template>
        </template>

        <div
            class="config-container__toggle bg-color-white cursor-pointer d-flex align-center justify-center"
            @click="containerHidden = focusMaterial ? !containerHidden : true"
        >
            <i
                class="mdi mdi-arrow-right-bold color-info fz-18"
                :class="focusMaterial ? 'mdi-cog' : 'mdi-cog-off'"
                :style="{
                    transform: `rotate(${containerHidden ? 360 : 0}deg)`,
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
    reactive,
    ref,
    Ref,
    watch,
} from 'vue';
import { Paper } from '../../classes/Paper';
import { AppState } from '../../classes/App';
import MyColorPicker from '../ui/MyColorPicker.vue';
import MyRangeInput from '../ui/MyRangeInput.vue';
import { Material } from '../../classes/Material';
import MySelect from '../ui/MySelect.vue';

export default defineComponent({
    name: 'MaterialConfig',
    components: { MySelect, MyRangeInput, MyColorPicker },
    setup() {
        const appState: Ref<AppState> = inject('app:state', ref('welcome'));
        const containerHidden = ref(true);
        const containerRight = computed(() =>
            appState.value === 'welcome'
                ? '-380px'
                : containerHidden.value
                ? '-300px'
                : '16px'
        );

        // Sketch组件注入
        const sketch: Ref = inject('sketch', ref({}));

        // 缩放值注入
        const scale: Ref<number> = inject('scale', ref(1));

        // Paper实例注入
        const paperInstance: Paper = inject('paper', new Paper({}));

        // 当前操作
        const focusMaterial: Material | void = inject('focus:material');
        watch(focusMaterial, (v) => {
            containerHidden.value = !v;
        });

        return {
            containerRight,
            containerHidden,
            focusMaterial,
        };
    },
});
</script>

<style scoped lang="scss">
@import 'src/styles/elevation';
.config-container {
    position: fixed;
    transition: 0.3s;
    width: 300px;
    height: auto;
    top: 50vh;
    transform: translateY(-50%);
    flex-direction: column;
    &__toggle {
        position: absolute;
        right: 348px;
        top: 50%;
        transform: translateX(100%) translateY(-50%);
        width: 48px;
        height: 48px;
        border-top-left-radius: 24px;
        border-bottom-left-radius: 24px;
        transition: 0.3s;
        @include elevation(3);

        i {
            transition: 0.4s;
        }
    }

    &:hover {
        .config-container__toggle {
            @include elevation(12);
        }
    }
}
</style>
