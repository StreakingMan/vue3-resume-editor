<template>
    <div
        ref="button"
        class="my-nav-item cursor-pointer ma-1 bg-color-primary-dark hover-elevation-4 d-flex flex-column align-center justify-center color-white"
    >
        <i
            class="my-nav-item__icon mdi fz-24"
            :class="'mdi-' + (icon || 'application')"
        ></i>
        <span class="my-nav-item__label fz-12">
            <slot></slot>
        </span>
    </div>
</template>

<script>
export default {
    name: 'MyIconButton',
    props: {
        icon: {
            type: String,
            default: '',
        },
    },
};
</script>

<style scoped lang="scss">
@import 'src/styles/color';
@import 'src/styles/animate';
@import 'src/styles/elevation';
.my-nav-item {
    width: 64px;
    height: 64px;
    border-radius: 4px;
    z-index: 1;
    @include transition(160ms);
    &__label {
        opacity: 0;
        transition: 0.2s;
        transform: translateY(50%);
        user-select: none;
    }
    &__icon {
        transform: translateY(6px);
        transition: 0.2s;
    }
    &:hover {
        transform: scale(1.4);
        z-index: 3;
        .my-nav-item {
            &__label {
                opacity: 1;
                display: inline;
                transform: translateY(0);
            }
            &__icon {
                transform: translateY(0);
            }
        }
    }
}
</style>
