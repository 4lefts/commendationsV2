<template>
<transition name="fade-in">
    <div class="form-outer" v-on:click="$emit('closeForm'); isInvalid = false">
        <div class="form-inner" v-on:click.stop>
        <button id="form-close-btn" v-on:click="$emit('closeForm'); isInvalid = false"><img src="../assets/close.svg" alt="close form"></button>
        <h2>Make a Commendation</h2>
            <input v-model="newCommendation.name" type="text" placeholder="Name" required />
            <select v-model="newCommendation.className" placeholder="Class" required>
                <option value="" disabled>Class</option>
                <option value="Butterflies">Butterflies</option>
                <option value="Ladybirds">Ladybirds</option>
                <option value="Woodpeckers">Woodpeckers</option>
                <option value="Wrens">Wrens</option>
                <option value="Chaffinches">Chaffinches</option>
                <option value="Partridges">Partridges</option>
                <option value="Puffins">Puffins</option>
                <option value="Swans">Swans</option>
                <option value="Kingfishers">Kingfishers</option>
                <option value="Mallards">Mallards</option>
                <option value="Kestrels">Kestrels</option>
                <option value="Owls">Owls</option>
                <option value="Eagles">Eagles</option>
                <option value="Falcons">Falcons</option>
            </select> 
            <textarea v-model="newCommendation.reason" placeholder="Reason" required></textarea>
            <transition name="slide-fade">
                <p class="invalid" v-show="isInvalid"><strong>Please complete all fields.</strong></p>
            </transition>
            <p><strong>Please note</strong>, the system does <strong>not</strong> add the word "for" to the beginning of the reason when certificates are printed. If you'd like your commendation to start with "for", please add it manually.</p>
            <button v-if="halibut" v-on:click="send" class="halibutton">
                <img src="../assets/halibut.png" alt="a picture of a halibut">
            </button>
            <button v-else v-on:click="send" class="normal-button">Submit</button>
        </div>
    </div>
</transition>
</template>

<script>
//helper functions

//check form is filled in
const checkInvalid = obj => {
    if(!obj.name || 
        obj.name === '' ||
        !obj.className ||
        obj.className === '' ||
        !obj.reason ||
        obj.reason === ''
    ){
        return true
    }
    return false
}

//parse date to store in firebase
const makeDateString = d => {
    const monthToNumber = m => {
        //hack to get jan = 1
        const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return months.indexOf(m).toString()
    }
    //zero pad date
    const zeroPad = s => {
        if(s.length == 2){
            return s
        } else {
            return '0' + s
        }
    }
    const tmp = d.toDateString().split(' ').slice(1)
    const m1 = monthToNumber(tmp[0])
    const m2 = zeroPad(m1)
    const d1 = zeroPad(tmp[1])
    const today = `${tmp[2]}-${m2}-${d1}`
    return today
}

//work out key stage from class name
const calcKS = c => {
    const ks1Classes = [
        "Butterflies",
        "Ladybirds",
        "Woodpeckers",
        "Wrens",
        "Chaffinches",
        "Partridges"
    ]
    const ks2Classes = [
        "Puffins",
        "Swans",
        "Kingfishers",
        "Mallards",
        "Kestrels",
        "Owls",
        "Eagles",
        "Falcons"
    ]
    if(ks1Classes.includes(c)){
        return 'ks1'
    } else if(ks2Classes.includes(c)){
        return 'ks2'
    }
}


export default {
    name: 'commendationForm',
    props: ['user'],
    data(){
        return {
            newCommendation: {
                date: '',
                timestamp: '',
                name: '',
                className: '',
                keyStage: '',
                reason: '',
                displayName: '',
                uid: '',
            },
            isInvalid: false,
        }
    },
    computed: {
        halibut(){
            if(this.user) return this.user.uid === 'raHK8Phs9PRhZ9DV7x53Yc4fct43' //|| this.user.uid === 'AgyXQthkIVfLn64p5NSm0ANkxGs2'
            else return false
        }
    },
    methods: {
        send(){
            if(checkInvalid(this.newCommendation)){
                this.isInvalid = true
                return false
            } else {
                this.isInvalid = false
                const d = new Date()
                this.newCommendation.timestamp = d.getTime()
                this.newCommendation.date = makeDateString(d)
                this.newCommendation.keyStage = calcKS(this.newCommendation.className)
                this.newCommendation.displayName = this.user.displayName
                this.newCommendation.uid = this.user.uid
                console.log(this.newCommendation)
                this.$emit('sendCommendation', this.newCommendation)
                Object.keys(this.newCommendation).forEach(key => this.newCommendation[key] = '')
            }
        },
    }
}

</script>

<style lang="scss" scoped>
@import '../scss/vars.scss';

.form-outer{
  z-index: 10;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .form-inner{
    @include card(5);
    max-width: 600px;
    margin: $gutter;
    background-color: white;
    border-radius: 2px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-content: center;
  }
}
h2{
    font-size: 2em;
    border-bottom: 2px solid $primary;
    margin: 0.3em 0 0.4em 0;
    padding-bottom: 0.1em; 
}
input, select, textarea{
    font-family: $fonts;
    font-size: 1em;
    display: block;
    width: 100%;
    margin: 10px 0;
    padding: $gutter;
    border: 1.6px solid $bg;
    border-radius: 2px;
    outline: none;
    background-color: $bg;
    &:focus{
        border: 1.6px solid $primary;
        background-color: white;
    }
}
textarea{
    height: 170px;
}
.normal-button{
    @include button-styles($primary, white);
    margin-top: $gutter;
    width: 120px;
}
.halibutton{
    @include button-styles($primary, white);
    width: 70px;
    height: 70px;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin-top: $gutter;
    &:hover, &:focus{
        outline: 0;
        @include card(5);
        transform: scale(1.1);
    }
}
#form-close-btn{
    @include button-styles($primary, white);
    width: 40px;
    height: 40px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    align-self: flex-end;
}
p{
    margin: 0.6em 0 0.6em 0;
}
.invalid{
    color: $accent;
}
.fade-in-enter-active, .fade-in-leave-active {
  transition: all .5s ease;
}
.fade-in-enter, .fade-in-leave-to{
  opacity: 0;
  transform: translateX(-2000px);
}
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to{
  transform: translateY(-20px);
  opacity: 0;
}

@media print {
    .commendation-form{
        display: none;
    }
}
</style>
