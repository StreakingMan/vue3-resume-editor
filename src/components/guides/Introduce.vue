<template>
    <div class="introduce" :class="`state-${appState}`">
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
            color="dark"
            type="blocked"
            class="mt-4"
            @click="appState = 'running'"
        >
            立即体验
        </MyButton>
    </div>
</template>

<script lang="ts">
import MyButton from '../ui/MyButton.vue';
import { defineComponent, inject } from 'vue';
import { AppState } from '../../classes/App';
export default defineComponent({
    name: 'Introduce',
    components: { MyButton },
    setup() {
        const appState: AppState = inject('app:state');
        return {
            appState,
        };
    },
    data: () => ({
        titleClick: false,
    }),
});
</script>

<style scoped lang="scss">
@import '../../styles/animate';
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

    &.state-running {
        top: 100vh;
        opacity: 0;
    }
}
</style>
