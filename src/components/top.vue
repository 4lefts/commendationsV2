<template>
    <header>
        <div v-if="user">
            <span>Signed in as {{user.displayName}}</span>
            <button v-on:click="signOut">Sign Out</button>
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
    z-index: 1;
    @include card(1);
    background-color: $primary;
    color: white;
    div{
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: $dark;
        height: 55px;
        text-align: right;
        padding: 5px 10px;
        button{
            @include button-styles($accent, white);
        }
    }
}

h3{
    font-size: 1.6em;
    padding: 1.4em 10px 1em 10px;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.24);
}

span{
    font-size: 0.8em;
    button {
        margin-left: $gutter;
    }
}

@media print {
    header{
        display: none;
    }
}
</style>
