<template>
    <label>
        <select v-model="value" @input="$emit('update:modelValue', value)">
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
