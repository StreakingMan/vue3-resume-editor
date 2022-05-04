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

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ConfigToggle',
    props: {
        modelValue: {
            type: String,
            default: 'solid',
            required: true,
        },
    },
    emits: ['update:modelValue'],
    computed: {
        value: {
            get() {
                return this.modelValue;
            },
            set(value: string) {
                this.$emit('update:modelValue', value);
            },
        },
    },
});
</script>
