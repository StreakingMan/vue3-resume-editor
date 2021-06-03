<template>
    <label>
        <span class="mr-2">
            <slot></slot>
        </span>
        <input
            v-model.number="value"
            type="range"
            :min="min"
            :max="max"
            @input="$emit('update:modelValue', value)"
        />
        <input
            v-model.number="value"
            type="number"
            :min="min"
            :max="max"
            @input="$emit('update:modelValue', value)"
        />
    </label>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'MyRangeInput',
    props: {
        modelValue: {
            type: Number,
            default: 0,
        },
        min: {
            type: Number,
            default: 0,
        },
        max: {
            type: Number,
            default: 50,
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
