<script setup lang="ts">
//
</script>

<template>
    <div class="info text-grey-darken-1 text-caption">
        Powered by
        <a
            class="text-grey-darken-1 text-caption text-decoration-none"
            href="https://vuejs.org/"
            target="_blank"
            rel="noopener noreferrer nofollow"
        >
            <v-icon size="small">mdi-vuejs</v-icon>
        </a>
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
