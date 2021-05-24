<template>
    <div class="material" :class="`material--state-${guideState}`"></div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'MaterialContainer',
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
.material {
    border-radius: 4px;
    position: fixed;
    background-color: $secondary-color;
    @include transition();

    &--state- {
        &0 {
            top: calc(15vh + 270px);
            left: calc(50vw - 100px);
            width: 200px;
            height: 60px;

            &:hover {
                transform: translateX(20px);
                @include elevation(8);
            }
        }
        &1 {
            width: 200px;
            height: calc(100vh - 126px);
            left: 24px;
            top: 102px;
            transition-delay: 0.2s;
            @include elevation(2);
        }
    }
}
</style>
