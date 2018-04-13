<template>
        <div class="message-box" v-bind:class="{showing: isShowing}">
            {{message}}
        </div>
    
</template>

<script>
export default {
    name: 'message',
    props: ['message', "isShowing"],
}
</script>

<style lang="scss" scoped>
@import '../scss/vars.scss';
.message-box{
    opacity: 0;
    transition: all 0.3s;
    transform: translateY(100px);
    position: absolute;
    z-index: 100;
    bottom: 0;
    left: 0;
    background-color: $accent;
    color: white;
    margin: 20px;
    padding: 20px;
    @include card(3);
}
.showing{
    opacity: 1;
    transform: translateY(0);
}
</style>
