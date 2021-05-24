<template>
    <div class="template" :class="`template--state-${guideState}`"></div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'TemplateContainer',
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
.template {
    background-color: $secondary-color;
    border-radius: 4px;
    position: fixed;
    top: calc(15vh + 200px);
    @include transition();

    &--state- {
        &0 {
            top: calc(15vh + 200px);
            left: calc(50vw - 100px);
            width: 200px;
            height: 60px;

            &:hover {
                transform: translateX(20px);
                @include elevation(8);
            }
        }
        &1 {
            left: 24px;
            top: 24px;
            transition-delay: 0.4s;
            @include elevation(2);
        }
    }
}
</style>
