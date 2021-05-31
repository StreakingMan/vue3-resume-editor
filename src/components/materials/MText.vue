<template>
    <div>MText</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export const test = '123';

export default defineComponent({
    name: 'MText',
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
