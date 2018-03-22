<template>
    <header>
        <template v-if="user">
            <h3>Commendations</h3>
            <span>Signed in as {{user.displayName}}</span>
            <button v-on:click="signOut">Sign Out</button>
        </template>
        <template v-else>
            <h3>Commendations</h3>
            <span>Not signed in</span>
        </template>
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
@media print {
    header{
        display: none;
    }
}
</style>
