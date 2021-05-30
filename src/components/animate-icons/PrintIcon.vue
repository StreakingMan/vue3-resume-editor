<template>
    <BaseAniIcon class="print-icon">
        <div class="container">
            <div class="outer1"></div>
            <div class="outer2"></div>
            <div class="dot"></div>
            <div class="paper"></div>
        </div>
        <div class="label">打印</div>
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
@import '../../styles/animate';
.print-icon {
    background-color: $primary-color-dark;
    animation-name: topFlyIn;
    animation-duration: 1.2s;
    position: fixed;
    right: 140px;
    top: 24px;
    color: white;

    .container {
        position: relative;
        display: flex;
        justify-content: center;
        @include transition();
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
        .paper {
            width: 40px;
            height: 4px;
            background-color: $primary-color-dark;
            position: absolute;
            top: 40px;
            @include transition();
        }
    }

    .label {
        position: absolute;
        bottom: 18px;
        text-align: center;
        opacity: 0;
        font-size: 0.85rem;
        width: 64px;
    }

    &:hover {
        .container {
            transform: translateY(-36px);
        }
        .paper {
            height: 12px;
            animation-name: print;
            animation-direction: alternate;
            animation-iteration-count: infinite;
            animation-duration: 0.5s;
        }
        .label {
            animation-name: twinkling;
            animation-direction: alternate;
            animation-iteration-count: infinite;
            animation-duration: 0.5s;
        }
    }
}

@keyframes print {
    0% {
        height: 4px;
    }
    100% {
        height: 24px;
        background-color: white;
    }
}
</style>
