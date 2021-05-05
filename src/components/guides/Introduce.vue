<template>
    <div class="introduce" :class="`introduce--state-${guideState}`">
        <h1>
            <span
                v-for="(s, index) in $t('message.appName')"
                :key="index"
                class="string jump"
                :style="{
                    animationDelay: index * 0.7 + 's',
                    animationPlayState: titleClick ? 'running' : 'paused',
                }"
                @mouseup="titleClick = !titleClick"
            >
                {{ s }}
            </span>
        </h1>
        <h2>
            <span
                v-for="(s, index) in $t('message.description')"
                :key="index"
                class="string"
            >
                {{ s }}
            </span>
        </h2>
        <MyButton
            size="large"
            color="accent"
            type="blocked"
            @click="guideState++"
        >
            立即体验
        </MyButton>
    </div>
</template>

<script lang="ts">
import MyButton from '../ui/MyButton.vue';
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'Introduce',
    components: { MyButton },
    data: () => ({
        titleClick: false,
    }),
    computed: {
        guideState: {
            set() {
                this.$store.state.guideState++;
            },
            get(): number {
                return this.$store.state.guideState;
            },
        },
    },
});
</script>

<style scoped lang="scss">
@import 'src/styles/animates';
.introduce {
    position: fixed;
    top: calc(15vh + 400px);
    text-align: center;
    color: white;
    animation-name: bottomFlyIn;
    animation-delay: 0s;
    animation-duration: 500ms;
    @include transition;

    .string {
        cursor: pointer;
        display: inline-block;
        padding: 2px;
        @include transition;

        &.jump {
            animation-name: jump;
            animation-iteration-count: infinite;
            animation-duration: 600ms;
        }

        &:hover {
            transform: translateY(-12px);
        }
    }

    &--state-1 {
        top: 100vh;
        opacity: 0;
    }
}
</style>
