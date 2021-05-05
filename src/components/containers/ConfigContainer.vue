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
    width: 80px;
    height: 80px;
    border-radius: 40px;
    position: fixed;
    top: calc(15vh + 100px);
    @include transition(480ms);

    &--state- {
        &0 {
            right: calc(50vw - 100px);
            &:hover {
                transform: translateX(20px);
            }
        }
        &1 {
            width: 400px;
            height: calc(100vh - 172px);
            right: 24px;
            top: 148px;
            border-radius: 4px;
            @include elevation(2);
        }
    }
}
</style>
