<script setup lang="ts">
import { usePaper } from '@/composables/useApp';
import { UseDraggable } from '@vueuse/components';
import { useRuntime } from '@/composables/useRuntime';

console.log('Mode:', import.meta.env.MODE, ' DevPanel loaded.');

const runtime = useRuntime();
const paper = usePaper();
</script>

<template>
    <UseDraggable
        :initial-value="{ x: 10, y: 600 }"
        storage-key="vueuse-draggable"
        storage-type="session"
        class="console-panel cursor-grab"
    >
        <VExpansionPanels variant="popout" multiple :model-value="['Runtime', 'Paper']">
            <VExpansionPanel
                v-for="(it, index) of [runtime, paper]"
                :key="index"
                :value="['Runtime', 'Paper'][index]"
                :title="['Runtime', 'Paper'][index]"
            >
                <VExpansionPanelText>
                    <template v-for="([key, value], idx) of Object.entries(it)" :key="idx">
                        <template v-if="typeof value !== 'object'">
                            {{ key }}: {{ value }},
                        </template>
                        <template v-else-if="value instanceof Set">
                            <br />{{ key }}: [{{ [...value].join(', ') }}],
                        </template>
                        <VExpansionPanels v-else>
                            <VExpansionPanel :title="key" :value="true">
                                <VExpansionPanelText>
                                    <template
                                        v-for="([k, v], i) of Object.entries(
                                            // @ts-ignore
                                            it[key],
                                        )"
                                        :key="i"
                                    >
                                        <template v-if="typeof v !== 'object'">
                                            {{ k }}: {{ v }},
                                        </template>
                                        <VExpansionPanels v-else>
                                            <VExpansionPanel :title="k">
                                                <VExpansionPanelText>
                                                    <template
                                                        v-for="([_k, _v], _i) of Object.entries(
                                                            // @ts-ignore
                                                            it[key][k],
                                                        )"
                                                        :key="_i"
                                                    >
                                                        <template v-if="typeof _v !== 'object'">
                                                            {{ _k }}: {{ _v }},
                                                        </template>
                                                        <template v-else>
                                                            {{ _k }}: {{ JSON.stringify(_v) }},
                                                        </template>
                                                    </template>
                                                </VExpansionPanelText>
                                            </VExpansionPanel>
                                        </VExpansionPanels>
                                    </template>
                                </VExpansionPanelText>
                            </VExpansionPanel>
                        </VExpansionPanels>
                    </template>
                </VExpansionPanelText>
            </VExpansionPanel>
        </VExpansionPanels>
    </UseDraggable>
</template>

<style scoped lang="scss">
.console-panel {
    position: fixed;
    z-index: 10000;
    width: 400px;
}

.cell {
    border: 1px solid #ccc;
}
</style>
