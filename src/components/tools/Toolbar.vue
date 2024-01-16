<script setup lang="ts">
import Print from './Print.vue';
import Align from './Align.vue';
import Github from './Github.vue';
import Save from './Save.vue';
import ImportExport from './ImportExport.vue';
import Group from './Group.vue';
import Outlook from '@/components/tools/ViewOpt.vue';
</script>

<template>
    <Align />
    <v-divider vertical class="mx-4"></v-divider>
    <Group />
    <v-divider vertical class="mx-4"></v-divider>
    <Outlook />
    <v-divider vertical class="mx-4"></v-divider>
    <Print />
    <ImportExport />
    <Save />
    <v-divider vertical class="mx-4"></v-divider>
    <Github />
</template>

<style scoped lang="scss">
:global(.v-toolbar) {
    @media print {
        display: none !important;
    }
}
</style>
