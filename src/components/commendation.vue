<template>
    <div class="commendation">
        <div class="display-commendation">
            <h3>{{data.name}}</h3>
            <h5>{{data.date}}</h5>
            <p v-show="showReason">{{data.reason}}</p>
            <button v-on:click="showReason = !showReason">
                <span v-if="!showReason">Show</span>
                <span v-else>Hide</span>
            </button>
            <button v-on:click="$emit('print', [data['.key']])">Print</button>
            <button v-on:click="$emit('remove', data['.key'])">Delete</button>
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
