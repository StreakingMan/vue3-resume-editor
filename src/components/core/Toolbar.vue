<template>
    <v-btn icon>
        <v-icon>mdi-align-horizontal-left</v-icon>
    </v-btn>
    <v-btn icon>
        <v-icon>mdi-align-horizontal-center</v-icon>
    </v-btn>
    <v-btn icon>
        <v-icon>mdi-align-horizontal-right</v-icon>
    </v-btn>
    <v-btn icon>
        <v-icon>mdi-align-horizontal-distribute</v-icon>
    </v-btn>
    <v-divider vertical class="mx-4"></v-divider>
    <v-btn icon>
        <v-icon>mdi-align-vertical-top</v-icon>
    </v-btn>
    <v-btn icon>
        <v-icon>mdi-align-vertical-center</v-icon>
    </v-btn>
    <v-btn icon>
        <v-icon>mdi-align-vertical-bottom</v-icon>
    </v-btn>
    <v-btn icon>
        <v-icon>mdi-align-vertical-distribute</v-icon>
    </v-btn>
    <v-divider vertical class="mx-4"></v-divider>
    <v-btn icon>
        <v-icon>mdi-grid</v-icon>
    </v-btn>
</template>

<script lang="ts">
import { defineComponent, inject, toRefs } from 'vue';
import { UnwrapNestedRefs } from '@vue/reactivity';
import { Paper } from '../../classes/Paper';

export default defineComponent({
    name: 'Toolbar',
    setup() {
        // Paper实例注入
        const paperInstance: UnwrapNestedRefs<Paper> = inject(
            'paper'
        ) as UnwrapNestedRefs<Paper>;
        return {
            paperInstance,
        };
    },
});
</script>

<style scoped lang="scss">
.toolbar {
    //
}
</style>
