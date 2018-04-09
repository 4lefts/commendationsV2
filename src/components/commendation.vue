<template>
    <div class="commendation">
        <div class="display-commendation">
            <h3>{{data.name}}</h3>
            <h5>{{data.date}}</h5>
            <div class="buttons-group">
                <button v-on:click="showReason = !showReason">
                    <img v-if="!showReason" src="../assets/more.svg" alt="show more">
                    <img v-else src="../assets/less.svg" alt="show less">
                </button>
                <button v-on:click="$emit('print', [data['.key']])">
                    <img src="../assets/print.svg" alt="">
                </button>
                <button v-on:click="$emit('remove', data['.key'])"><img src="../assets/delete.svg" alt=""></button>
            </div>
            <transition name="slide-fade">
                <p v-show="showReason">{{data.reason}}</p>
            </transition>
        </div>
        <div class="print-commendation" v-bind:class="{print: printList.includes(data['.key'])}">
            <pre>{{data}}</pre>
        </div>
    </div>
    
</template>

<script>
export default {
    name: 'commendation',
    props: ['data', 'printList'],
    data(){
        return {
            showReason: false
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../scss/vars.scss';

.display-commendation{
    @include card(2);
    background-color: white;
    color: $text;
    h3{
        font-size: 1.3em;
        padding: $gutter;
        padding-bottom: 0.2em;
    }
    h5{
        font-size: 0.8em;
        padding: $gutter;
        padding-top: 0;
        border-bottom: 2px solid $primary;
    }
    .buttons-group{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        padding: $gutter;
    }
    p{
        padding: $gutter;
    }
    button{
        @include button-styles($primary, white);
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        margin-left: 5px;
        padding: 0;
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .3s ease;
}
//  {
//   transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
// }
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(-20px);
  opacity: 0;
}

@media screen {
    .display-commendation{
        display: block;
    }
    .print-commendation{
        display: none;
    }
}

@media print {
    .display-commendation, .print-commendation{
        display: none;
    }
    .print{
        display: block;
    }
}
</style>
