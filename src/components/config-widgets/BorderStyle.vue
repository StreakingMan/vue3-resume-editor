<script setup lang="ts">
import { computed } from 'vue';
import ConfigToggle from './ConfigToggle.vue';
import ConfigToggleOption from './ConfigToggleOption.vue';

const props = withDefaults(
    defineProps<{
        modelValue: string;
        hasNull?: boolean;
    }>(),
    {
        modelValue: 'none',
        hasNull: false,
    },
);

const emits = defineEmits(['update:modelValue']);

const value = computed({
    get: () => props.modelValue,
    set: (v: string) => emits('update:modelValue', v),
});
</script>

<template>
    <ConfigToggle v-model="value">
        <ConfigToggleOption value="solid">
            <div style="width: 40px; height: 0; border-top: 2px solid black"></div>
        </ConfigToggleOption>
        <ConfigToggleOption value="dotted">
            <div style="width: 40px; height: 0; border-top: 2px dotted black"></div>
        </ConfigToggleOption>
        <ConfigToggleOption value="dashed">
            <div style="width: 40px; height: 0; border-top: 2px dashed black"></div>
        </ConfigToggleOption>
        <ConfigToggleOption v-if="hasNull" value="none" label="无" />
    </ConfigToggle>
</template>
