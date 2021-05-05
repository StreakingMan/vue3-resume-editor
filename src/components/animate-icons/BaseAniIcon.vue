<template>
    <div
        class="animate-icon"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <div class="animate-icon__inner">
            <slot v-bind="hover"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BaseAniIcon',
    data: () => ({
        hover: false,
    }),
};
</script>

<style scoped lang="scss">
@import 'src/styles/elevations';
.animate-icon {
    height: 100px;
    width: 100px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    @include elevationTransition();
    @include elevation(2);

    &:hover {
        @include elevation(8);
    }

    &__inner {
        width: 64px;
        height: 64px;
    }
}
</style>
