<template>
  <section class="commendation-form">
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
        <transition name="slide-down">
            <div class="invalid" v-show="isInvalid">Please complete all fields.</div>
        </transition>
        <p><strong>Please note</strong>, the system does <strong>not</strong> add the word "for" to the beginning of the reason when certificates are printed. If you'd like your commendation to start with "for", please add it manually.</p>
        <button v-if="halibut" v-on:click="send" class="halibutton">
            <img src="../assets/halibut.png" alt="a picture of a halibut">
        </button>
        <button v-else v-on:click="send" class="normal-button">Submit</button>
  </section>
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
            if(this.user) return this.user.uid === 'raHK8Phs9PRhZ9DV7x53Yc4fct43' || this.user.uid === 'AgyXQthkIVfLn64p5NSm0ANkxGs2'
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
input, select, textarea{
    display: block;
    width: 100%;
    margin: 10px 0;
}

textarea{
    height: 120px;
}

.halibutton{
    width: 50px;
    height: 50px;
    img{
        width: 100%;
    }
}

@media print {
    .commendation-form{
        display: none;
    }
}
</style>
