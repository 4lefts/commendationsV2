<template>
    <div class="commendation">
        <div class="display-commendation">
            <header>
                <div class="headings">
                    <h3>{{data.name}}</h3>
                    <h5>{{data.date}}</h5>
                </div>
                <div class="buttons-group">
                    <button  v-on:click="showReason = !showReason">
                        <img class="show-more-icon" v-bind:class="{down: showReason}" src="../assets/more.svg" alt="show more">
                    </button>
                    <button v-on:click="$emit('print', [data['.key']])">
                        <img src="../assets/print.svg" alt="">
                    </button>
                    <button v-on:click="$emit('remove', data['.key'])"><img src="../assets/delete.svg" alt=""></button>
                </div>
            </header>
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
    },
}
</script>

<style lang="scss" scoped>
@import '../scss/vars.scss';

.display-commendation{
    @include card(2);
    border-radius: 2px;
    background-color: white;
    color: $text;
    header{
        z-index: 2;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid $primary;
    }
    h3{
        font-size: 1em;
        padding: $gutter;
        padding-bottom: 0.2em;
    }
    h5{
        font-size: 0.7em;
        padding: $gutter;
        padding-top: 0;
    }
    .buttons-group{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        padding: $gutter;
    }
    p{
        font-size: 0.8em;
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
        width: 35px;
        height: 35px;
        border-radius: 50%;
    }
    .show-more-icon{
        transition: transform 0.2s linear;
    }
    .down{
        transform: rotate(180deg);
    }
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to{
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
