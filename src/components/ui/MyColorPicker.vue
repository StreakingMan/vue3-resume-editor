<template>
    <label>
        <span class="mr-2">
            <slot></slot>
        </span>
        <input
            v-model="value"
            type="color"
            @input="$emit('update:modelValue', value)"
        />
        {{ modelValue }}
    </label>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'MyColorPicker',
    props: {
        modelValue: {
            type: String,
            default: '',
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
