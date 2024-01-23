<script setup lang="ts">
defineProps<{
    title: string;
}>();
</script>
<template>
    <div class="d-flex align-center">
        <div class="d-flex text-subtitle-2" style="width: 72px; min-width: 72px">
            {{ title }}<v-spacer />：
        </div>
        <slot></slot>
    </div>
</template>
