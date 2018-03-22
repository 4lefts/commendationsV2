import Vue from 'vue'
import App from './App.vue'
import firebase from 'firebase'
import Vuefire from 'vuefire'
Vue.use(Vuefire)

//initialise firebase
const config = {
  apiKey: "AIzaSyDl-Ep3w5gJIwUA1ZQ7syUmW1DZ6fV2EhI",
  authDomain: "commendations01.firebaseapp.com",
  databaseURL: "https://commendations01.firebaseio.com",
  projectId: "commendations01",
  storageBucket: "commendations01.appspot.com",
  messagingSenderId: "856242512076"
};
firebase.initializeApp(config);

//initialise Vue
let app
firebase.auth().onAuthStateChanged(user => {
  if(!app) {
    app = new Vue({
      el: '#app',
      render: h => h(App)
    })
  }
})
