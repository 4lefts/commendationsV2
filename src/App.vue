<template>
  <div id="app" v-cloak v-on:keyup.esc="showDeleteModal = false; showForm = false">
    <top v-bind:user="user"/>
    <main v-if="user" class="main-screen">
      <button id="show-form-btn" v-on:click="showForm = true"><img src="./assets/create.svg" alt="create a commendation"></button>
      <commendation-form
      v-show="showForm"
      v-bind:user="user"
      v-on:closeForm="showForm = false"
      v-on:sendCommendation="send" />
      <section v-if="loading">Loading...</section>
      <section v-else-if="commendations.length > 0">
        <h3>This Week</h3>
        <button id="print-all-btn" v-if="thisWeek.length > 0" v-on:click="printAll">Print All</button>
        <div v-if="thisWeek.length > 0" class="commendations-list">
          <commendation
          v-for="commendation in thisWeek"
          v-bind:key="commendation['.key']"
          v-bind:data="commendation"
          v-bind:printList="printList"
          v-on:print="print"
          v-on:remove="openDeleteModal" />
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
          v-on:remove="openDeleteModal" />
        </div>
        <div v-else>
          <span>You have no previous commendations.</span>
        </div>
      </section>
      <section v-else>
        <span>You haven't made any commendations. Commend someone!</span>
      </section>
      <transition name="fade-in">
        <div class="modal-outer" v-if="showDeleteModal">
          <div class="modal-inner">
            <p>Are you sure you want to delete this commendation?</p>
            <div class="buttons">
              <button v-on:click="remove">Yes</button>
              <button v-on:click="showDeleteModal = false">No</button>
            </div>
          </div>
        </div>
      </transition>
      <transition name="fade-up">
        <message 
        v-bind:isShowing="messageBoxShowing"
        v-bind:message="message"
        />
      </transition>
    </main>
    <main v-else class="login-screen">
      <div class="login-contents">
        <p>Hello. Welcome to the Decoy School Commendations app.</p>
        <button v-on:click="signIn">Sign In</button>
        <p>Please use a Decoy School staff account.</p>
      </div>
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
import message from './components/message.vue'

export default {
  name: 'app',
  components: {
    top,
    bottom,
    commendationForm,
    commendation,
    message,
  },
  data () {
    return {
      user: null,
      db: firebase.database(),
      loading: false,
      commendations: [],
      printList: [],
      showDeleteModal: false,
      showForm: false,
      removeKey: '',
      messageBoxShowing: false,
      message: '',
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
      this.db.ref(`commendations/${this.user.uid}`).push(payload, () => {
        this.showForm = false
        this.showMessage('Commendation Saved!')
      })  
    },
    remove(){
      this.db.ref(`commendations/${this.user.uid}`).child(this.removeKey).remove()
        .then(() => {
          console.log(`${this.removeKey} removed`)
          this.showDeleteModal = false
          this.showMessage('Commendation Deleted!')
        })
        .catch(err => console.err(err))
    },
    openDeleteModal(key){
      this.removeKey = key
      this.showDeleteModal = true
    },
    showMessage(msg){
      this.message = msg
      this.messageBoxShowing = true
      setTimeout(() => this.messageBoxShowing = false, 2000)
    }
  },
  computed: {
    reversedCommendations(){
      return this.commendations.slice().reverse() //slice copies array first
    },
    sunday(){
      const d = new Date()
      const day = d.getDay()
      const diff = day % 7
      d.setDate(d.getDate() - diff)
      d.setHours(0)
      d.setMinutes(0)
      d.setSeconds(0)
      d.setMilliseconds(0)
      return d.getTime()
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
  },
}
</script>

<style lang="scss" scoped>
@import './scss/vars.scss';

[v-cloak] > * {display: none}
[v-cloack]::before {content: 'loading'}

// some kind of display fallback here?

@supports (display: grid){
  #app{
    display: grid;
    min-height: 100vh;
    grid-template-rows: auto 1fr auto;
  }
  .commendations-list{
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    margin: 30px 0;
  }
}

.login-screen{
  display: flex;
  background: url('./assets/loginBG.jpg') no-repeat center center fixed;
  background-size: cover;
  align-items: center;
  justify-content: center;
  .login-contents{
    @include card(3);
    background-color:rgba(255, 255, 255, 0.7);
    width: 300px;
    height: 300px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    text-align: center;
    flex-direction: column;
    button{
      @include button-styles($primary, white);
      width: 200px;
      margin: 0;
    }
    p {
      margin: 0;
    }
  }
}

#app{
  background-color: $bg;
  font-family: $fonts;
}
.main-screen{
  padding: 30px $gutter;
}
h2{
  font-size: 2.4em;

}
h3{
  font-size: 2em;
  border-bottom: 2px solid $primary;
  margin: 0.3em 0 0.4em 0;
  padding-bottom: 0.1em; 
}
#print-all-btn{
  @include button-styles($primary, white);
  margin-top: $gutter;
}
#show-form-btn{
  z-index: 2;
  @include button-styles($accent, white);
  @include card(2);
   &:hover, &:focus{
    outline: 0;
    @include card(5);
    transform: scale(1.1);
  }
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 30px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
.modal-outer{
  z-index: 10;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  .modal-inner{
    @include card(3);
    background-color: white;
    border-radius: 2px;
    padding: 40px;
    .buttons{
      padding-top: 20px;
      display: flex;
      width: 100%;
      justify-content: space-around;
      button{
        @include button-styles($primary, white);
        margin-bottom: 0;
      }
    }
  }
}
.fade-in-enter-active, .fade-in-leave-active {
  transition: opacity .3s;
}
.fade-in-enter, .fade-in-leave-to{
  opacity: 0;
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
