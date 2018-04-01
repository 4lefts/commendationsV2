<template>
    <header>
        <div v-if="user">
            <span>Signed in as {{user.displayName}}
            <button v-on:click="signOut">Sign Out</button></span>
        </div>
        <div v-else>
            <span>Not signed in</span>
        </div>
        <h3>Decoy School Commendations</h3>
    </header>
</template>

<script>
import firebase from 'firebase'
export default {
    name: 'top',
    props: ['user'],
    methods: {
        signOut(){
            firebase.auth().signOut()
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../scss/vars.scss';

header{
    @include card(1);
    background-color: $primary;
    margin-bottom: $gutter;
    // padding: $gutterV $gutterH;
    div{
        background-color: $dark;
        text-align: right;
        padding: 5px 10px;
    }
}

h3{
    font-size: 1.6em;
    padding: 1em 10px 0.6em 10px;
}

span{
    font-size: 0.8em;
    button {
        margin-left: $gutter;
    }
}

@supports (display: grid){
    header{
        // display: grid;
        // grid-template-columns: 1fr max-content ;
        // align-items: center;
        // grid-gap: $gutterH;
    }
}


@media print {
    header{
        display: none;
    }
}
</style>
