<template>
    <div class="toolbar" :class="`toolbar--state-${guideState}`"></div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ToolbarContainer',
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
.toolbar {
    background-color: $secondary-color;
    border-radius: 4px;
    position: fixed;
    @include transition();

    &--state- {
        &0 {
            width: 200px;
            height: 36px;
            top: calc(15vh + 48px);
            &:hover {
                transform: translateX(20px);
                @include elevation(8);
            }
        }
        &1 {
            width: 600px;
            height: 54px;
            top: 24px;
            transition-delay: 0.5s;
            @include elevation(2);
        }
    }
}
</style>
