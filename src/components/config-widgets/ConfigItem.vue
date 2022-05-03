<template>
    <div class="d-flex align-center">
        <div class="text-subtitle-2">{{ title }}：</div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'ConfigItem',
    props: {
        title: {
            type: String,
            default: '标题',
            required: true,
        },
    },
};
</script>

<style scoped></style>
