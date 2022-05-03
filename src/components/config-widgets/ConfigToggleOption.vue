<template>
    <v-btn :value="value" variant="text" size="small">
        <slot>
            <v-icon v-if="icon">{{ icon }}</v-icon>
            {{ label }}
        </slot>
    </v-btn>
</template>

<script>
export default {
    name: 'ConfigToggleOption',
    props: {
        label: {
            type: String,
            default: '',
            required: false,
        },
        value: {
            type: String,
            default: '',
            required: true,
        },
        icon: {
            type: String,
            default: '',
            required: false,
        },
    },
};
</script>

<style scoped></style>
