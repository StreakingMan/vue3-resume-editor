<template v-if="groups.length">
    <template v-for="(group, idx) in groups" :key="`group${group}`">
        <div
            v-if="curItem.groupName.split('.').length > 1"
            class="group"
            draggable="true"
            :style="{
                marginLeft:
                    curItem.groupName.split('.').length * 24 -
                    (groups.length - idx) * 24 +
                    'px',
            }"
        >
            {{ group }}
        </div>
    </template>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { Item } from '../interface/Item';
import { getGroupsByGroupNameDiff } from '../algorithms/group';
export default defineComponent({
    name: 'ListVirtualGroup',
    props: {
        preItem: {
            type: Object,
            default: null,
        },
        curItem: {
            type: Object,
            default: null,
        },
    },
    setup(props) {
        const calcVirtualGroups = (preItem: Item, curItem: Item) => {
            return getGroupsByGroupNameDiff(
                preItem?.groupName || '',
                curItem.groupName
            );
        };
        const groups = computed(() =>
            calcVirtualGroups(props.preItem, props.curItem)
        );

        return {
            groups,
        };
    },
});
</script>

<style scoped lang="scss">
.group {
    margin: 4px;
    padding: 4px;
    border-radius: 2px;
    border: 1px solid grey;
    user-select: none;
    background-color: lightblue;
}
</style>
