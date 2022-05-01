<template>
    <v-menu v-model="visible" anchor="end">
        <template #activator="{ props }">
            <div
                class="activator"
                :style="{
                    transform: `translateY(${
                        active || hover ? -100 : 0
                    }%) scale(${1 / scale})`,
                    opacity: active || hover ? 1 : 0,
                }"
            >
                <slot name="activator"></slot>
                <v-btn
                    v-bind="props"
                    variant="outlined"
                    color="primary"
                    size="x-small"
                    :disabled="!(active || hover)"
                    icon
                    :rounded="0"
                >
                    <v-icon size="x-small">mdi-cog</v-icon>
                    <v-tooltip activator="parent" anchor="top">
                        配置面板
                    </v-tooltip>
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
import { defineComponent, toRef } from 'vue';
import { useMaterial, useRuntime } from '../../composables/useApp';

export default defineComponent({
    name: 'MaterialConfigPopover',
    components: {},
    setup() {
        const runtime = useRuntime();
        const material = useMaterial();

        return {
            scale: toRef(runtime.scale, 'value'),
            hover: toRef(material, 'hover'),
            active: toRef(material, 'active'),
            instance: toRef(material, 'instance'),
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
