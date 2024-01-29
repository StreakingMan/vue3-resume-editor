<template>
    <v-divider vertical class="mx-4"></v-divider>

    <template v-for="opt of alignButtons.slice(0, 4)" :key="opt.icon">
        <v-btn icon :disabled="alignOperateDisable" @click="opt.onClick">
            <v-icon>{{ opt.icon }}</v-icon>
        </v-btn>
    </template>

    <template v-for="opt of alignButtons.slice(4)" :key="opt.icon">
        <v-btn icon :disabled="alignOperateDisable" @click="opt.onClick">
            <v-icon>{{ opt.icon }}</v-icon>
        </v-btn>
    </template>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { usePaper } from '@/composables/useApp';
import { useRuntime } from '@/composables/useRuntime';

type AlignCommandType =
    | 'alignHorizontalLeft'
    | 'alignHorizontalCenter'
    | 'alignHorizontalRight'
    | 'alignHorizontalDistribute'
    | 'alignVerticalTop'
    | 'alignVerticalCenter'
    | 'alignVerticalBottom'
    | 'alignVerticalDistribute';

const alignOptions: Array<{
    icon: string;
    command: AlignCommandType;
}> = [
    {
        icon: 'mdi-align-horizontal-left',
        command: 'alignHorizontalLeft',
    },
    {
        icon: 'mdi-align-horizontal-center',
        command: 'alignHorizontalCenter',
    },
    {
        icon: 'mdi-align-horizontal-right',
        command: 'alignHorizontalRight',
    },
    {
        icon: 'mdi-align-horizontal-distribute',
        command: 'alignHorizontalDistribute',
    },
    {
        icon: 'mdi-align-vertical-top',
        command: 'alignVerticalTop',
    },
    {
        icon: 'mdi-align-vertical-center',
        command: 'alignVerticalCenter',
    },
    {
        icon: 'mdi-align-vertical-bottom',
        command: 'alignVerticalBottom',
    },
    {
        icon: 'mdi-align-vertical-distribute',
        command: 'alignVerticalDistribute',
    },
];

export default defineComponent({
    name: 'Align',
    setup() {
        const runtime = useRuntime();
        const paper = usePaper();

        const alignOperateDisable = computed(() => runtime.activeMaterialSet.size < 2);

        const alignButtons: Array<{
            icon: string;
            onClick: () => void;
        }> = alignOptions.map((opt) => ({
            icon: opt.icon,
            onClick: () => paper[opt.command]([...runtime.activeMaterialSet]),
        }));

        return {
            alignOperateDisable,
            alignButtons,
        };
    },
});
</script>
