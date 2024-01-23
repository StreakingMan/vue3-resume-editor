<script setup lang="ts">
withDefaults(
    defineProps<{
        label?: string;
        value: string;
        icon?: string;
    }>(),
    {
        label: '',
        value: '',
        icon: '',
    },
);
</script>

<template>
    <v-btn :value="value" variant="text" size="small">
        <slot>
            <v-icon v-if="icon">{{ icon }}</v-icon>
            {{ label }}
        </slot>
    </v-btn>
</template>
