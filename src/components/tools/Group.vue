<template>
    <v-btn icon :disabled="groupDisable" @click="group">
        <v-icon>mdi-group</v-icon>
        <v-tooltip activator="parent" anchor="bottom">合并分组</v-tooltip>
    </v-btn>
    <v-btn icon :disabled="ungroupDisable" @click="ungroup">
        <v-icon>mdi-ungroup</v-icon>
        <v-tooltip activator="parent" anchor="bottom">解除分组</v-tooltip>
    </v-btn>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { usePaper, useRuntime } from '../../composables/useApp';

export default defineComponent({
    name: 'Group',
    setup() {
        const runtime = useRuntime();
        const paper = usePaper();

        const groupDisable = computed(() => {
            // 至少两个才可编组
            return runtime.activeMaterialSet.size < 2 || !ungroupDisable.value;
        });
        const ungroupDisable = computed(() => {
            // 当前激活列表全部为一个分组才可取消编组
            const groupIds = [...runtime.activeMaterialSet]
                .map((mId) => paper.queryMaterial(mId)?.groupId)
                .filter((groupId) => !!groupId);
            if (groupIds.length !== runtime.activeMaterialSet.size)
                return false;
            return [...new Set(groupIds)].length !== 1;
        });

        const group = () => {
            paper.groupMaterials([...runtime.activeMaterialSet]);
        };
        const ungroup = () => {
            const m = paper.queryMaterial([...runtime.activeMaterialSet][0]);
            if (m?.groupId) {
                paper.unGroupMaterials(m.groupId);
            }
        };

        return {
            groupDisable,
            ungroupDisable,
            group,
            ungroup,
        };
    },
});
</script>
