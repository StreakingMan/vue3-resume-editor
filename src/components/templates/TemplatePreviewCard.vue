<template>
    <div class="template-preview--card"></div>
</template>

<script>
export default {
    name: 'TemplatePreviewCard',
    computed: {
        positionStyle() {
            return '1';
        },
    },
};
</script>

<style scoped lang="scss">
.template-preview--card {
    width: 124px;
    height: 174px;
    border: 1px solid lightblue;
}
</style>