<template>
    <div class="toolbar"></div>
</template>

<script>
export default {
    name: 'ConfigContainer',
};
</script>

<style scoped lang="scss">
@import 'src/styles/colors';
@import 'src/styles/elevations';
.toolbar {
    background-color: $secondary-color;
    width: 80px;
    height: 80px;
    margin-left: 160px;
    border-radius: 40px;
    position: fixed;
    top: calc(15vh + 100px);
    transition: 280ms cubic-bezier(0.4, 0, 0.2, 1);
    &:hover {
        transform: translateX(20px);
    }
}
</style>
