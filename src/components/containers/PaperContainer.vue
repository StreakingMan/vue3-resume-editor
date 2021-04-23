<template>
    <div class="paper">
        <slot name="default"></slot>
    </div>
</template>

<script>
export default {
    name: 'PaperContainer',
};
</script>

<style scoped lang="scss">
@import 'src/styles/colors';
@import 'src/styles/elevations';
.paper {
    border-radius: 12px;
    width: 248px;
    height: 348px;
    background-color: $primary-color-light;
    position: fixed;
    top: 15vh;
    @include elevationTransition();
    @include elevation(2);
    &:hover {
        @include elevation(14);
    }
    &::after {
        content: '';
        position: absolute;
        right: 0;
        top: 0;
        width: 0;
        height: 0;
        border: 20px solid $primary-color-dark;
        border-bottom-left-radius: 12px;
        border-top-right-radius: 12px;
        border-left-color: $primary-color;
        border-bottom-color: $primary-color;
        @include elevation(2);
    }
}
</style>
