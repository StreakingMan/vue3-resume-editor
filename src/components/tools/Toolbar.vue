<template>
    <Align />
    <v-divider vertical class="mx-4"></v-divider>
    <View />
    <v-divider vertical class="mx-4"></v-divider>
    <Print />
    <Save />
    <v-divider vertical class="mx-4"></v-divider>
    <Github />
    <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
    </v-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Print from './Print.vue';
import Align from './Align.vue';
import View from './View.vue';
import Github from './Github.vue';
import Save from './Save.vue';

export default defineComponent({
    name: 'Toolbar',
    components: { Save, Github, View, Align, Print },
});
</script>

<style scoped lang="scss">
.toolbar {
    //
}
</style>
