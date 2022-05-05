<template>
    <a
        class="beian text-grey-darken-1 text-caption text-decoration-none"
        href="https://beian.miit.gov.cn/"
        target="_blank"
        rel="noopener noreferrer nofollow"
    >
        浙ICP备17007857号-2
    </a>
</template>

<script>
export default {
    name: 'Beian',
};
</script>

<style scoped lang="scss">
.beian {
    position: fixed;
    right: 8px;
    bottom: 8px;
    z-index: 100;
    @media print {
        display: none;
    }
}
</style>
