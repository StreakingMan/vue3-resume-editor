<template>
    <div class="toolbar"></div>
</template>

<script>
export default {
    name: 'ToolbarContainer',
};
</script>

<style scoped lang="scss">
@import 'src/styles/colors';
@import 'src/styles/elevations';
.toolbar {
    background-color: $secondary-color;
    width: 200px;
    height: 36px;
    border-radius: 4px;
    position: fixed;
    top: calc(15vh + 48px);
    transition: 280ms cubic-bezier(0.4, 0, 0.2, 1);
    &:hover {
        transform: translateX(20px);
    }
}
</style>
