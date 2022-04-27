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
                <slot name="activator"></slot>
                <v-btn
                    v-bind="props"
                    variant="outlined"
                    color="primary"
                    size="x-small"
                    :disabled="!active"
                    icon="mdi-cog"
                    :rounded="0"
                >
                </v-btn>
            </div>
        </template>
        <v-sheet rounded width="300" class="px-6 py-8">
            <slot name="config"></slot>
            <v-divider class="my-3 mx-n6"></v-divider>
            <div class="text-subtitle-2">通用配置</div>
            <div class="d-flex align-center">
                <div class="text-subtitle-2">width:</div>
                <input v-model="instance.w" type="number" />
            </div>
            <div class="d-flex align-center">
                <div class="text-subtitle-2">height:</div>
                <input v-model="instance.h" type="number" />
            </div>
        </v-sheet>
    </v-menu>
</template>

<script lang="ts">
import { defineComponent, inject, ref, Ref } from 'vue';
import { Paper } from '../../classes/Paper';
import { Material } from '../../classes/Material';

export default defineComponent({
    name: 'MaterialConfigPopover',
    components: {},
    setup() {
        // Sketch组件注入
        const sketch: Ref = inject('sketch', ref({}));

        // 缩放值注入
        const scale: Ref<number> = inject('scale', ref(1));

        // Paper实例注入
        const paperInstance: Paper = inject('paper') as Paper;

        // 当前操作
        const focusMaterial: Ref = inject('focus:material') as Ref;

        // 元素实例
        const instance: Material<any> = inject(
            'm-instance',
            {}
        ) as Material<any>;
        const active = inject('m-instance:active', {});

        return {
            active,
            focusMaterial,
            scale,
            instance,
        };
    },
    data: () => ({
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
    min-width: max-content;
    background-color: rgba(255, 255, 255, 0.6);
}
</style>
