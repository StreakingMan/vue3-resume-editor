<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        modelValue: string;
        noMargin?: boolean;
    }>(),
    {
        modelValue: '',
        noMargin: false,
    },
);

const emits = defineEmits(['update:modelValue']);

const value = computed({
    get: () => props.modelValue,
    set: (v: string) => emits('update:modelValue', v),
});
</script>

<template>
    <v-sheet
        width="24"
        height="24"
        class="position-relative border rounded"
        :class="noMargin ? '' : 'ma-2 ml-0'"
        :color="value"
        style="cursor: pointer"
    >
        <div v-if="!value" class="no-color"></div>
        <v-menu activator="parent" :close-on-content-click="false">
            <v-color-picker v-model="value" show-swatches></v-color-picker>
        </v-menu>
    </v-sheet>
</template>

<style scoped>
.no-color {
    position: absolute;
    width: 30px;
    height: 2px;
    background: red;
    transform: rotate(45deg);
    left: -5px;
    top: 11px;
}
</style>
