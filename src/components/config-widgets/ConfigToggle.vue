<script lang="ts" setup>
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        modelValue: string;
    }>(),
    {
        modelValue: 'solid',
    },
);
const emits = defineEmits(['update:modelValue']);
const value = computed({
    get: () => props.modelValue,
    set: (v: string) => emits('update:modelValue', v),
});
</script>

<template>
    <v-btn-toggle
        v-model="value"
        color="primary"
        class="border"
        style="height: 36px"
        mandatory
        divided
    >
        <slot />
    </v-btn-toggle>
</template>
