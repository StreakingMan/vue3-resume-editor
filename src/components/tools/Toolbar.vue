<template>
    <Align />
    <v-divider vertical class="mx-4"></v-divider>
    <Group />
    <v-divider vertical class="mx-4"></v-divider>
    <View />
    <v-divider vertical class="mx-4"></v-divider>
    <Print />
    <ImportExport />
    <Save />
    <v-divider vertical class="mx-4"></v-divider>
    <Github />
    <v-btn
        icon
        href="https://next.vuetifyjs.com/"
        target="_blank"
        rel="nofollow"
    >
        <v-icon>mdi-vuetify</v-icon>
        <v-tooltip activator="parent" anchor="bottom">
            powered by vuetify@3.0.0-beta.1
        </v-tooltip>
    </v-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Print from './Print.vue';
import Align from './Align.vue';
import View from './View.vue';
import Github from './Github.vue';
import Save from './Save.vue';
import ImportExport from './ImportExport.vue';
import Group from './Group.vue';

export default defineComponent({
    name: 'Toolbar',
    components: { Group, ImportExport, Save, Github, View, Align, Print },
});
</script>

<style scoped lang="scss">
.toolbar {
    //
}
:global(.v-toolbar) {
    @media print {
        display: none !important;
    }
}
</style>
