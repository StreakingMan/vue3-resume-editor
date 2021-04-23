<template>
    <PaperContainer> </PaperContainer>
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

export default defineComponent({
    name: 'Logo2LayoutTransfer',
    components: {
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
