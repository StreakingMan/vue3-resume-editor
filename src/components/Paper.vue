<template>
    <div class="paper a4 ma-6">
        <ItemContainer
            v-for="(item, i) in reverseItems"
            :key="item.id"
            v-model:item="reverseItems[i]"
        ></ItemContainer>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, computed } from 'vue';
import { Item } from '../interface/Item';
import ItemContainer from './ItemContainer.vue';

export default defineComponent({
    name: 'Paper',
    components: { ItemContainer },
    setup() {
        const items = ref<Item[]>(inject('items', []));
        const reverseItems = computed(() => items.value.slice().reverse());
        return {
            reverseItems,
        };
    },
});
</script>

<style lang="scss" scoped>
.paper {
    box-shadow: 0 2px 8px 0 rgb(0 0 0 / 10%);
    border-radius: 2px;
    border: 1px solid #dbdbdb;
    position: relative;
    &.a4 {
        width: 620px;
        height: 877px;
    }
}
</style>
