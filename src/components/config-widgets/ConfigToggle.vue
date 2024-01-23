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
const emit = defineEmits(['update:modelValue']);
const value = computed({
    get() {
        return props.modelValue;
    },
    set(value: string) {
        emit('update:modelValue', value);
    },
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
