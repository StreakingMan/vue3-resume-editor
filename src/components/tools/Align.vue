<template>
    <template v-for="opt of alignButtons.slice(0, 4)" :key="opt.icon">
        <v-btn icon :disabled="alignOperateDisable" @click="opt.onClick">
            <v-icon>{{ opt.icon }}</v-icon>
        </v-btn>
    </template>

    <v-divider vertical class="mx-4"></v-divider>

    <template v-for="opt of alignButtons.slice(4)" :key="opt.icon">
        <v-btn icon :disabled="alignOperateDisable" @click="opt.onClick">
            <v-icon>{{ opt.icon }}</v-icon>
        </v-btn>
    </template>
</template>

<script lang="ts">
import { computed, defineComponent, inject, Ref } from 'vue';
import { Material } from '../../classes/Material';
import { UnwrapNestedRefs } from '@vue/reactivity';
import { Paper } from '../../classes/Paper';

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
        // Paper实例注入
        const paperInstance: UnwrapNestedRefs<Paper> = inject(
            'paper'
        ) as UnwrapNestedRefs<Paper>;

        const focusMaterialList = inject('focus:materialList') as Ref<
            Material<any>['id'][]
        >;

        const alignOperateDisable = computed(
            () => focusMaterialList.value.length < 2
        );

        const alignButtons: Array<{
            icon: string;
            onClick: () => void;
        }> = alignOptions.map((opt) => ({
            icon: opt.icon,
            onClick: () => paperInstance[opt.command](focusMaterialList.value),
        }));

        return {
            paperInstance,
            alignOperateDisable,
            alignButtons,
        };
    },
});
</script>
