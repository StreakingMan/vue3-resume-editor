<template>
    <div>MTitle</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'MTitle',
    props: {
        config: {
            type: Object,
            default: () => ({}),
        },
    },
    emits: ['update:config'],
});
</script>

<style scoped lang="scss">
//
</style>
