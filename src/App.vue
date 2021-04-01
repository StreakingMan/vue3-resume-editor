<template>
    {{ o.a }}
    <List></List>
    <Paper></Paper>
</template>

<script lang="ts">
import { defineComponent, reactive, provide } from 'vue';
import Paper from './components/Paper.vue';
import List from './components/List.vue';

export default defineComponent({
    name: 'App',
    components: { List, Paper },
    provide: {},
    setup() {
        const items = reactive([
            { id: 1, x: 0, y: 110, groupName: '' },
            { id: 2, x: 60, y: 20, groupName: 'A' },
            { id: 3, x: 500, y: 300, groupName: 'A.B' },
            { id: 4, x: 400, y: 200, groupName: 'A.C' },
            { id: 5, x: 200, y: 600, groupName: 'B' },
            { id: 6, x: 200, y: 0, groupName: 'B' },
            { id: 7, x: 100, y: 100, groupName: 'A' },
            { id: 8, x: 600, y: 400, groupName: 'B' },
        ]);

        provide('items', items);
    },
    methods: {},
});
</script>

<style lang="scss">
body {
    margin: 0;
    padding: 0;
}
#app {
    padding: 24px;
    display: flex;
}
</style>
