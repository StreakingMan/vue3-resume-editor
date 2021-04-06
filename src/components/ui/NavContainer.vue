<template>
    <div class="nav">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'NavContainer',
};
</script>

<style scoped lang="scss">
.nav {
    position: fixed;
    bottom: 0;
    transition: 0.3s;
    transform: translateY(80%);
    display: flex;
    &:hover {
        transform: translateY(0);
    }
}
</style>
