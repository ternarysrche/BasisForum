<template>
    <div class="threads-display">
       
        <div class="threads-display container">
            <h2 class="grey-text text-darken-3">All Posts</h2>
            <div class="row">
                <form class="col s12" v-on:submit.prevent>
                    <div class="row">
                        <div class="input-field col s6">
                        <input id="search" type="text" class="validate">
                        <label for="search">🔍 Search up any question you want</label>
                        </div>
                    </div>
                </form>
            </div>
            <div class= "card white" v-for="(thread, index) in searchedPosts" :key="index">
                <!-- thread title -->
                <span class="thread-title">{{ thread.title }}</span>
                <!-- thread author -->
                
                <!-- thread body -->
                    <!-- <v-list-content> -->
                <p class="body-text">{{ thread.body | snippet }}</p>
                    <!-- </v-list-content> -->
                <div class="px30"></div>
                <!-- timestamp -->
                <span class="time grey-text">{{ thread.timestamp }}</span>
                <span class="thread-author">By: {{ thread.firstName }} {{ thread.lastName }}</span>
                <!-- expand thread button -->
                <router-link :to="{ name: 'MessagesDisplay', params: {title_slug: thread.slug } }">
                    <btn class="btn-floating btn-medium halfway-fab red">
                        <i class="material-icons" @click="setEmail(user.email)" >comment</i>
                    </btn>
                </router-link>
                <div class="px30"></div>
            </div>
            <!-- add post button -->
            <router-link :to="{ name: 'AddPost' }">
                <btn class="btn-floating btn-large corner red" style="position: fixed">
                    <i class="material-icons" @click="setEmail(user.email)">add</i>
                    <!-- <v-icon dark></v-icon> -->
                </btn>
            </router-link>
        </div>  
    </div>
</template>


<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import moment from 'moment'
import axios from 'axios'

export default {
    name: 'ThreadDisplay',
    data() {
        return {
            threads: [],
            user: null,
            userEmail: null,
            upvotes: [],
            upvoted: [],
            score: [],
            searchTerm: ""
        }
    },
    methods: {
        setEmail(theEmail) {
            localStorage.setItem("email", theEmail)
        },
        upVote(post, index) {
            this.color[index] = false;
            this.upvotes = []
            db.collection('threads').doc(post).collection('upvotes').get().then(snapshot => {
                snapshot.forEach(doc => {
                    this.upvotes.push(doc.data().upvote)
                })
                let x = this.upvotes.includes(this.userEmail)
                this.upvoted[index].value = x
                if (!this.upvotes.includes(this.userEmail)) {
                    db.collection('threads').doc(post).collection('upvotes').add({
                        "upvote": this.userEmail
                    })
                    this.upvoted[index].value = true
                    this.score[index].value += 1;
                }
                else {
                    let id = "";
                    db.collection('threads').doc(post).collection('upvotes').where('upvote', '==', this.userEmail).get().then(snapshot => {
                        snapshot.forEach(doc => {
                            id = doc.id
                            let res = db.collection('threads').doc(post).collection('upvotes').doc(id).delete().then(function() {
                            })
                        })
                    })
                    this.upvoted[index].value = false;
                    this.score[index].value -= 1;
                }
            })
        },
    },

    computed: {
        searchedPosts(){
            return this.threads.filter(thread => {
                return thread.title.toLowerCase().match(this.searchTerm.toLowerCase())
            })
        }
    },
    beforeCreate(){
        console.log("entered THREADS DISPLAY")
    },
    created() {
        var counter = 0;
        db.collection('threads').orderBy('timestamp', 'desc').get()
        .then(snapshot => {
            snapshot.forEach(async doc => {
                let thread = doc.data()
                thread.id = doc.id
                thread.timestamp = moment(doc.data().timestamp).format('lll')
                thread.author = doc.data().author
                let snapshot = await db.collection('users').where('email', '==', thread.author).get()
                snapshot.forEach(doc => {
                    let a = doc.data()
                    thread.firstName = a.firstName
                    thread.lastName = a.lastName
                })
                console.log(thread.firstName)
                console.log(thread.lastName)
                this.upvoted.push({
                    value:false
                })
                this.threads.push(thread)
                console.log(this.threads.length)
                let index = this.threads.length-1
                let snapshot2 = await db.collection('threads').doc(thread.id).collection('upvotes').get()
                snapshot2.forEach(doc => {
                    this.upvotes.push(doc.data().upvote)
                    console.log(doc.data().upvote)
                })
                this.score.push({
                    value: this.upvotes.length
                })
                console.log(this.upvotes)
                firebase.auth().onAuthStateChanged((user) => {
                    if(user){
                        this.user = user
                        this.userEmail = user.email
                    } else {
                        this.user = null
                    }
                })
                console.log(this.upvotes.includes(this.userEmail))
                if (this.upvotes.includes(this.userEmail)) {
                    this.upvoted[counter].value = true
                }
                else {
                    this.upvoted[counter].value = false
                }
                this.upvotes = []
                counter ++;
            })
        })
    }
}
</script>

<style scoped>
 .input-field input:focus + label {
   color: red !important;
 }
 /* label underline focus color */
 .row .input-field input:focus {
   border-bottom: 1px solid red !important;
   box-shadow: 0 1px 0 0 red !important
 }
.upVote {
    cursor: pointer;
}
.px30 {
    height: 30px;
}
.px40 {
    height: 40px;
}
.enter {
    position: absolute;
    right: 80px;
}
.body-text {
    color: gray;
    font-size: 15px;
    padding: 10px;
}
.thread-author {
    position: absolute;
    bottom: 5px;
    left: 10px;
    color: gray;
    font-size: 15px;
    padding: 10px;
}
.threads-display {
    font-family: 'Montserrat', sans-serif;
}
.threads-display h2{
    font-size: 2.6em;
    margin-top: 0pc;
}
.threads-display ul{
    text-align: left;
}
.card {
    margin-bottom: 50px;
    padding: 20px;
}
.threads-display .card-content{
    font-size: 1.4em;
}
.thread-title {
    position: absolute;
    left: 10px;
    top: 3px;
    font-weight: bold;
    font-size: 23px;
}
.threads-display .time{
    position: absolute;
    right:10px;
    top:3px;
    font-size: 0.8em;
}
.corner {
    position: absolute;
    bottom: 50px;
    right: 50px;
}

.container {
  width: 90vw;
  margin: 0 auto;
}

@media (max-width: 500px) {
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-content: space-around;
    grid-column-gap: 10px;
    grid-row-gap: 10px;
  }
}

@media (min-width: 500px) {
  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    align-content: space-around;
    grid-column-gap: 15px;
    grid-row-gap: 15px;
  }
}

@media (min-width: 700px) {
  .grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    align-content: space-around;
    grid-column-gap: 15px;
    grid-row-gap: 15px;
  }
}

@media (min-width: 900px) {
  .grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    align-content: space-around;
    grid-column-gap: 15px;
    grid-row-gap: 15px;
  }
}

img {
  width: 100%;
  height: auto;
}
</style>
