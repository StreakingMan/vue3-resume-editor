<template>
    <v-menu v-model="visible" anchor="end">
        <template #activator="{ props }">
            <div
                class="activator"
                :style="{
                    transform: `translateY(-100%) scale(${1 / scale})`,
                    opacity: active ? 1 : 0,
                }"
            >
                <slot></slot>
                <v-btn
                    v-bind="props"
                    variant="outlined"
                    color="grey-darken-1"
                    size="x-small"
                    :disabled="!active"
                    icon="mdi-cog"
                    :rounded="0"
                >
                </v-btn>
            </div>
        </template>
        <v-sheet rounded width="300" class="pa-6">
            <div class="text-caption">Typography</div>
            <v-slider
                v-model="instance.config.typo"
                :max="3"
                thumb-label
                step="1"
                tick-size="4"
            >
                <template #thumb-label="{ modelValue }">
                    <div class="text-no-wrap">
                        {{
                            {
                                0: 'text-h1',
                                1: 'text-h2',
                                2: 'text-h3',
                                3: 'text-h4',
                                4: 'text-h5',
                            }[modelValue]
                        }}
                    </div>
                </template>
            </v-slider>
        </v-sheet>
    </v-menu>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref, Ref, watch } from 'vue';
import { Paper } from '../../classes/Paper';
import { AppState } from '../../classes/App';
import { Material } from '../../classes/Material';
import prototypeMap from '../materials/prototypes';
import { CTRL_DOT_SIZE } from './config';

export default defineComponent({
    name: 'MaterialConfig',
    components: {},
    props: {
        active: {
            type: Boolean,
            default: false,
            require: true,
        },
    },
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
        const focusMaterial: Ref = inject('focus:material') as Ref;
        const configOptions = ref(null);
        watch(focusMaterial, (v) => {
            containerHidden.value = !v;
            configOptions.value =
                prototypeMap[focusMaterial?.value?.config?.componentName]
                    ?.configOptions || null;
            console.log(configOptions);
        });

        // 元素实例
        const instance: Material = inject('m-instance', {}) as Material;

        return {
            containerRight,
            containerHidden,
            focusMaterial,
            configOptions,
            scale,
            instance,
        };
    },
    data: () => ({
        CTRL_DOT_SIZE,
        visible: false,
    }),
});
</script>

<style scoped lang="scss">
.activator {
    position: absolute;
    right: 0;
    top: 0;
    transition: 0.3s;
    transform: translateY(-100%);
    transform-origin: right bottom;
}
</style>
