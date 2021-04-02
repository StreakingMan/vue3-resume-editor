<template>
    <List></List>
    <Paper></Paper>
    <Observer></Observer>
    <div class="source-pre">
        原始数据
        <pre>{{ JSON.stringify(sourceData, null, 4) }}</pre>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, provide } from 'vue';
import Paper from './components/Paper.vue';
import List from './components/List.vue';
import Observer from './components/Observer.vue';
import { sortByGroup } from './algorithms/group';

export default defineComponent({
    name: 'App',
    components: { Observer, List, Paper },
    provide: {},
    setup() {
        const sourceData = [
            { id: 1, x: 0, y: 110, groupName: 'root' },
            { id: 2, x: 60, y: 20, groupName: 'root.A' },
            { id: 3, x: 500, y: 300, groupName: 'root.A.B' },
            { id: 4, x: 400, y: 200, groupName: 'root.A.C' },
            { id: 5, x: 200, y: 600, groupName: 'root.B' },
            { id: 6, x: 200, y: 0, groupName: 'root.B' },
            { id: 7, x: 100, y: 100, groupName: 'root.A' },
            { id: 8, x: 600, y: 400, groupName: 'root.B.D' },
            { id: 9, x: 100, y: 400, groupName: 'root.A.B' },
        ];

        const items = reactive(sortByGroup(sourceData));

        provide('items', items);

        return { sourceData };
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
.source-pre {
    margin: 24px;
    width: 300px;
}
</style>