<template>
    <BaseAniIcon class="print-icon">
        <div class="container">
            <div class="outer1"></div>
            <div class="outer2"></div>
            <div class="dot"></div>
            <div class="paper"></div>
        </div>
    </BaseAniIcon>
</template>

<script>
import { defineComponent } from 'vue';
import BaseAniIcon from './BaseAniIcon.vue';

export default defineComponent({
    name: 'PrintIcon',
    components: { BaseAniIcon },
});
</script>

<style scoped lang="scss">
@import 'src/styles/colors';
.print-icon {
    background-color: $primary-color-dark;
    position: fixed;
    right: 140px;
    top: 24px;
    .container {
        position: relative;
        display: flex;
        justify-content: center;
        .outer1 {
            width: 100%;
            height: 36px;
            border-radius: 4px;
            background-color: white;
            position: absolute;
            top: 20px;
        }
        .outer2 {
            width: 60%;
            height: 24px;
            border-radius: 4px;
            background-color: white;
            position: absolute;
            top: 10px;
        }
        .dot {
            width: 10px;
            height: 10px;
            border-radius: 5px;
            position: absolute;
            right: 4px;
            top: 24px;
            background-color: $primary-color-dark;
        }
    }
}
</style>
