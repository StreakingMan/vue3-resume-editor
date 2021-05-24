<template>
    <div class="paper" :class="`paper--state-${guideState}`">
        <slot v-if="guideState === 1"></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';

export default defineComponent({
    name: 'PaperContainer',
    setup() {
        console.log(inject('fuck'));
    },
    computed: {
        guideState() {
            return this.$store.state.guideState;
        },
    },
});
</script>

<style scoped lang="scss">
@import 'src/styles/colors';
@import 'src/styles/elevations';
@import 'src/styles/animates';
.paper {
    position: fixed;
    @include transition;
    @include elevation(2);

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
        transform-origin: right top;
        @include transition();
        @include elevation(2);
    }

    &--state- {
        &0 {
            width: 248px;
            height: 348px;
            top: 15vh;
            background-color: $primary-color-light;
            border-radius: 12px;

            &:hover {
                @include elevation(8);
            }
        }
        &1 {
            width: 496px;
            height: 696px;
            top: 96px;
            background-color: white;
            border-radius: 4px;
            transition-delay: 0.3s;
            &::after {
                transform: scale(0);
            }
        }
    }
}
</style>
