<template>
    <ConfigToggle v-model="value">
        <ConfigToggleOption value="solid">
            <div
                style="width: 40px; height: 0; border-top: 2px solid black"
            ></div>
        </ConfigToggleOption>
        <ConfigToggleOption value="dotted">
            <div
                style="width: 40px; height: 0; border-top: 2px dotted black"
            ></div>
        </ConfigToggleOption>
        <ConfigToggleOption value="dashed">
            <div
                style="width: 40px; height: 0; border-top: 2px dashed black"
            ></div>
        </ConfigToggleOption>
        <ConfigToggleOption v-if="hasNull" value="none" label="无" />
    </ConfigToggle>
</template>

<script>
import { defineComponent } from 'vue';
import ConfigToggle from './ConfigToggle.vue';
import ConfigToggleOption from './ConfigToggleOption.vue';

export default defineComponent({
    name: 'BorderStyle',
    components: { ConfigToggleOption, ConfigToggle },
    props: {
        modelValue: {
            type: String,
            default: 'solid',
            required: true,
        },
        hasNull: {
            type: Boolean,
            default: false,
            required: false,
        },
    },
    emits: ['update:modelValue'],
    computed: {
        value: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit('update:modelValue', value);
            },
        },
    },
});
</script>

<style scoped></style>
