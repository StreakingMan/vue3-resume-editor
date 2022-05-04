<template>
    <div class="d-flex align-center">
        <div class="d-flex text-subtitle-2" style="width: 72px">
            {{ title }}<v-spacer />：
        </div>
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
