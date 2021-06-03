<template>
    <label>
        <span class="mr-2">
            <slot></slot>
        </span>
        <select v-model="value" @change="$emit('update:modelValue', value)">
            <option v-for="op in options" :key="op.value" :value="op.value">
                {{ op.label || op.value }}
            </option>
        </select>
    </label>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'MySelect',
    props: {
        modelValue: {
            type: String,
            default: '',
        },
        options: {
            type: Array,
            default: () => [],
        },
    },
    emits: ['update:modelValue'],
    setup(props) {
        return { value: ref(props.modelValue) };
    },
});
</script>

<style scoped lang="scss">
//
</style>
