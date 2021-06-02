<template>
    <label>
        <textarea
            v-model="value"
            @input="$emit('update:modelValue', value)"
        />
    </label>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'MyTextFiled',
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
