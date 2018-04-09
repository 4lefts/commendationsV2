<template>
  <div id="app" v-cloak>
    <top v-bind:user="user"/>
    <main v-if="user" class="main-screen">
      <commendation-form
      v-show="false"
      v-bind:user="user"
      v-on:sendCommendation="send" />
      <section v-if="loading">Loading...</section>
      <section v-else-if="commendations.length > 0">
        <h3>This Week</h3>
        <button v-if="thisWeek.length > 0" v-on:click="printAll">Print All</button>
        <div v-if="thisWeek.length > 0" class="commendations-list">
          <commendation
          v-for="commendation in thisWeek"
          v-bind:key="commendation['.key']"
          v-bind:data="commendation"
          v-bind:printList="printList"
          v-on:print="print"
          v-on:remove="remove" />
        </div>
        <div v-else>
          <span>You haven't made any commendations this week. Commend someone!</span>
        </div>
        <h3>Previously</h3>
        <div v-if="previous.length > 0" class="commendations-list">
          <commendation
          v-for="commendation in previous"
          v-bind:key="commendation['.key']"
          v-bind:data="commendation"
          v-bind:printList="printList"
          v-on:print="print"
          v-on:remove="remove" />
        </div>
        <div v-else>
          <span>You have no previous commendations.</span>
        </div>
      </section>
      <section v-else>
        <span>You haven't made any commendations. Commend someone!</span>
      </section>
    </main>
    <main v-else class="login-screen">
      <button v-on:click="signIn">
      <!-- <img src="./assets/login.jpg" alt="background image">   -->
      <span>Sign In</span>
      </button>
      <p>Please use a Decoy School staff account.</p>
    </main>
    <bottom />
  </div>
</template>

<script>
import firebase from 'firebase'
import top from './components/top.vue'
import bottom from './components/bottom.vue'
import commendationForm from './components/commendationForm.vue'
import commendation from './components/commendation.vue'

export default {
  name: 'app',
  components: {
    top,
    bottom,
    commendationForm,
    commendation
  },
  data () {
    return {
      user: null,
      db: firebase.database(),
      loading: false,
      commendations: [],
      printList: []
    }
  },
  methods: {
    signIn(){
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(provider)
    },
    print(ks){
      this.printList = ks
      setTimeout(() => window.print(), 100)
    },
    printAll(){
      const ks = this.thisWeek.map(c => c['.key'])
      this.print(ks)
    },
    send(payload){
      console.log(`sending ${JSON.stringify(payload, null, 3)}`)
      this.db.ref(`commendations/${this.user.uid}`).push(payload)  
    },
    remove(key){
      this.db.ref(`commendations/${this.user.uid}`).child(key).remove()
        .then(() => console.log(`${key} removed`))
        .catch(err => console.err(err))
    }
  },
  computed: {
    reversedCommendations(){
      return this.commendations.slice().reverse() //slice copies array first
    },
    sunday(){
      const d = new Date()
      return d.setDate(d.getDate() - d.getDay())
    },
    thisWeek(){
      return this.reversedCommendations.filter(c => c.timestamp >= this.sunday) 
    },
    previous(){
      return this.reversedCommendations.filter(c => c.timestamp < this.sunday)
    }

  },
  beforeCreate(){
    firebase.auth().onAuthStateChanged(user => {
      this.loading = true
      if(user){
        this.user = user
        this.$bindAsArray('commendations', this.db.ref(`commendations/${this.user.uid}`), null, () => {
          this.loading = false
        })
      } else {
        this.user = null
        this.commendations = []
        this.loading = false
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import './scss/vars.scss';

[v-cloak] > * {display: none}
[v-cloack]::before {content: 'loading'}

// some kind of display fallback here

@supports (display: grid){
  #app{
    display: grid;
    min-height: 100vh;
    grid-template-rows: auto 1fr auto;
  }
  .commendations-list{
    display: grid;
    grid-gap: $gutter;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

.login-screen{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  button{
    box-sizing: border-box;
    width: 300px;
    height: 300px;
    margin-bottom: 30px;
    padding: 0;
    background: url('./assets/login.jpg');
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    border: 3px solid $primary;
    border-radius: 50%;
    overflow: hidden;
    @include card(1);
    transition: all .3s ease;
    &:hover, &:focus{
      outline: 0;
      @include card(5);
    }
    span{
      color: white;
      display: inline-block;
      width: 300px;
      height: 50px;
      line-height: 50px;
      background-color: rgba($primary, 0.3);
      font-size: 2em;
      text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.24);
    }
  }
}

#app{
  background-color: $bg;
  font-family: $fonts;
}
main{
  padding: 0 $gutter;
}
h2{
  font-size: 2.4em;

}
h3{
  font-size: 2em;
  border-bottom: 2px solid $primary;
  margin-bottom: 0.4em;
}
@media print{
  h2, h3, button, span{
    display: none;
  }
  .commendations-list{
    display: block;
  }
}
</style>
