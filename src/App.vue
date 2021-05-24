<template>
    <ToolbarContainer></ToolbarContainer>
    <MaterialContainer></MaterialContainer>
    <ConfigContainer></ConfigContainer>
    <TemplateContainer></TemplateContainer>
    <PaperContainer>
        <Sketch></Sketch>
    </PaperContainer>
    <Introduce></Introduce>
    <GitHubIcon></GitHubIcon>
    <PrintIcon></PrintIcon>
</template>

<script lang="ts">
import { defineComponent, reactive, provide } from 'vue';
import { sortByGroup } from './algorithms/group';
import { useStore } from './stores';
import Sketch from './components/core/Sketch.vue';
import PaperContainer from './components/containers/PaperContainer.vue';
import Introduce from './components/guides/Introduce.vue';
import ToolbarContainer from './components/containers/ToolbarContainer.vue';
import MaterialContainer from './components/containers/MaterialContainer.vue';
import ConfigContainer from './components/containers/ConfigContainer.vue';
import TemplateContainer from './components/containers/TemplateContainer.vue';
import GitHubIcon from './components/animate-icons/GitHubIcon.vue';
import PrintIcon from './components/animate-icons/PrintIcon.vue';

export default defineComponent({
    name: 'App',
    components: {
        PrintIcon,
        GitHubIcon,
        TemplateContainer,
        ConfigContainer,
        MaterialContainer,
        ToolbarContainer,
        Introduce,
        PaperContainer,
        Sketch,
    },
    provide: {},
    methods: {},
});
</script>

<style lang="scss">
@import 'styles/colors';
body {
    margin: 0;
    padding: 0;
    background-color: $primary-color;
}
#app {
    padding: 24px;
    display: flex;
    justify-content: center;
}

.sketch-container {
    width: 80vw;
    height: 80vh;
}
</style>
