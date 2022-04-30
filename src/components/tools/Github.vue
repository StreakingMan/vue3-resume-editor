<template>
    <v-btn
        icon
        tag="a"
        href="https://github.com/StreakingMan/vue3-resume-editor"
        target="_blank"
    >
        <v-icon>mdi-github</v-icon>
        <v-tooltip activator="parent" anchor="bottom">
            star, issue or pr!
        </v-tooltip>
    </v-btn>
</template>

<script>
export default {
    name: 'Github'
};
</script>
