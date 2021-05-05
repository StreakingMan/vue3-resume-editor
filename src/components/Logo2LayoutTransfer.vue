<template>
    <PaperContainer>
        <Paper></Paper>
    </PaperContainer>
    <ToolbarContainer></ToolbarContainer>
    <ConfigContainer></ConfigContainer>
    <TemplateContainer></TemplateContainer>
    <MaterialContainer></MaterialContainer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PaperContainer from './containers/PaperContainer.vue';
import ToolbarContainer from './containers/ToolbarContainer.vue';
import ConfigContainer from './containers/ConfigContainer.vue';
import TemplateContainer from './containers/TemplateContainer.vue';
import MaterialContainer from './containers/MaterialContainer.vue';
import Paper from "./Paper.vue";

export default defineComponent({
    name: 'Logo2LayoutTransfer',
    components: {
        Paper,
        MaterialContainer,
        TemplateContainer,
        ConfigContainer,
        ToolbarContainer,
        PaperContainer,
    },
});
</script>

<style scoped lang="scss">
//
</style>
