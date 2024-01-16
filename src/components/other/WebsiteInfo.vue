<script setup lang="ts">
//
</script>

<template>
    <div class="info text-grey-darken-1 text-caption">
        <a
            class="text-grey-darken-1 text-caption text-decoration-none"
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer nofollow"
        >
            浙ICP备17007857号-2
        </a>
        | Powered by
        <a
            class="text-grey-darken-1 text-caption text-decoration-none"
            href="https://vuetifyjs.com/"
            target="_blank"
            rel="noopener noreferrer nofollow"
        >
            <v-icon size="small">mdi-vuetify</v-icon>
        </a>
    </div>
</template>

<style scoped lang="scss">
@import '@/styles/mixins.scss';

.info {
    position: fixed;
    right: 8px;
    bottom: 8px;
    z-index: 100;
    @include printNone;
}
</style>
