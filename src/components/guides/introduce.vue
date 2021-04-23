<template>
    <div class="introduce">
        <h1>{{ $t('message.appName') }}</h1>
        <h2>{{ $t('message.description') }}</h2>
    </div>
</template>

<script>
export default {
    name: 'Introduce',
};
</script>

<style scoped lang="scss">
.introduce {
    position: fixed;
    top: calc(15vh + 400px);
    text-align: center;
    color: white;
}
</style>
