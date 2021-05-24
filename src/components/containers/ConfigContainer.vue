<template>
    <div class="config" :class="`config--state-${guideState}`"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ConfigContainer',
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
.config {
    background-color: $secondary-color;
    border-radius: 40px;
    position: fixed;
    @include transition();

    &--state- {
        &0 {
            width: 80px;
            height: 80px;
            top: calc(15vh + 100px);
            right: calc(50vw - 100px);

            &:hover {
                transform: translateX(20px);
                @include elevation(8);
            }
        }
        &1 {
            width: 300px;
            height: calc(100vh - 172px);
            right: 24px;
            top: 148px;
            border-radius: 4px;
            transition-delay: 0.1s;
            @include elevation(2);
        }
    }
}
</style>
