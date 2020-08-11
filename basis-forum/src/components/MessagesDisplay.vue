<template>
    <div class="messages-display" style="width: 90vw; margin: 0 auto; max-width: 900px">
        <div class= "card white">
            <div class="card-content">
                <span class="time">{{ postDisplay.timestamp }}</span>
                <span class="thread-title">{{ postDisplay.title }}</span>
                <p class="body-text">{{ postDisplay.body }}</p>
                
                <span class="thread-author">By: {{ postDisplay.firstName }} {{ postDisplay.lastName }}</span>
                    <!-- <v-list-tile-content> -->
                   
                    <!-- </v-list-tile-content> -->
                
            </div>
            <div class="card-action">
                <PostReply />
            </div>
        </div>
  
        <!-- -----------end of post ------------->

        <h5 class="grey-text text-darken-2 center-align prevReply">Previous Replies</h5>
        <div class= "card white" v-for="(message, index) in messages" :key="index">
            <div class="card-content">
                <!-- thread title -->
                <span class="time">{{ message.timestamp }}</span>
                <span class="thread-title">RE: {{ postDisplay.title }}</span>
                <!-- thread author -->
                <span class="reply-author">By: {{ message.firstName }} {{ message.lastName }}</span>
                <!-- thread body -->
                    <!-- <v-list-content> -->
                        <p class="body-text">{{ message.body | snippet }}</p>
                    <!-- </v-list-content> -->
                <div class="px30"></div>
                <!-- timestamp -->
                <!-- expand thread button -->
                <i class="material-icons upVote" @click="upVote(message.id, index)" v-if="upvoted[index]" v-bind:class="{ pinks : upvoted[index].value, blacks : !upvoted[index].value}">favorite</i>
                <span class="upvoted" v-if="score[index]">{{ score[index].value }}</span>
            </div>
        </div>
        <router-link :to="{ name: 'ThreadsDisplay' }">
            <btn class="btn-floating btn-large corner red" style="position: fixed">
                <i class="material-icons" @click="setEmail(user.email)">keyboard_backspace</i>
                <!-- <v-icon dark></v-icon> -->
            </btn>
        </router-link>
        
    </div>
</template>

<script>
import db from '@/firebase/init'
import PostReply from '@/components/PostReply'
import moment from 'moment'
import firebase from 'firebase'

export default {
    name: 'MessagesDisplay',
    components: {
      PostReply,
    },
    data() {
        return {
            messages: [],
            postDisplay: {},
            upvotes: [],
            upvoted: [],
            score: [],
            user: {}
        }
    },
    methods: {
      saveEmail() {
        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                this.user = user
            } else {
                this.user = ""
            }
        })
      },
      upVote(post, index) {
          console.log(index);
          console.log(this.upvotes.includes(this.user.email));
            this.upvotes = []
            db.collection('post-replies').doc(post).collection('upvotes').get().then(snapshot => {
                snapshot.forEach(doc => {
                    this.upvotes.push(doc.data().upvote)
                })
                let x = this.upvotes.includes(this.user.email)
                this.upvoted[index].value = x
                if (!this.upvoted[index].value) {
                    db.collection('post-replies').doc(post).collection('upvotes').add({
                        "upvote": this.user.email
                    })
                    this.upvoted[index].value = true
                    this.score[index].value += 1;
                }
                else {
                    let id = "";
                    db.collection('post-replies').doc(post).collection('upvotes').where('upvote', '==', this.user.email).get().then(snapshot => {
                        snapshot.forEach(doc => {
                            id = doc.id
                            let res = db.collection('post-replies').doc(post).collection('upvotes').doc(id).delete().then(function() {
                            })
                        })
                    })
                    this.upvoted[index].value = false;
                    this.score[index].value -= 1;
                }
            })
        }
    },
    beforeCreate(){
        console.log("entered MSG DISPLAY")
    },
    created() {
        db.collection('threads').where('slug', '==', this.$route.params.title_slug).get()
        .then(snapshot => {
            snapshot.forEach(async doc => {
                let post = doc.data()
                console.log('post: ' + post)
                post.id = doc.id
                console.log('post.id: ' + post.id)
                post.timestamp = moment(doc.data().timestamp).format('lll')
                console.log('post.timestamp: ' + post.timestamp)
                post.title = doc.data().title
                console.log('post.title: ' + post.title)
                post.body = doc.data().body
                console.log('post.body: ' + post.body)
                let snapshot = await db.collection('users').where('email', '==', post.author).get()
                snapshot.forEach(doc => {
                    let a = doc.data()
                    console.log('aF: '+a.firstName)
                    console.log('aL: '+a.lastName)
                    post.firstName = a.firstName
                    post.lastName = a.lastName
                })
                this.postDisplay = post
                var counter = 0
                db.collection('post-replies').where('post_slug', '==', this.$route.params.title_slug).get().then(snapshot => {
                    snapshot.forEach(async doc => {
                        let y = doc.data()
                        y.timestamp = moment(doc.data().timestamp).format('lll')
                        y.id = doc.id
                        let snapshot = await db.collection('users').where('email', '==', y.author).get()
                        snapshot.forEach(doc => {
                            let z = doc.data()
                            y.firstName = z.firstName
                            y.lastName = z.lastName
                            console.log(y.firstName)
                            console.log(y.lastName)
                            this.messages.push(y)
                        })
                        let snapshot2 = await db.collection('post-replies').doc(y.id).collection('upvotes').get()
                        snapshot2.forEach(doc => {
                            this.upvotes.push(doc.data().upvote)
                            console.log(doc.data().upvote)
                        })
                        this.upvoted.push({
                            value: false
                        })
                        this.score.push({
                            value: this.upvotes.length
                        })
                        console.log(this.upvotes)
                        this.user.email = firebase.auth().currentUser.email
                        console.log(this.upvotes.includes(this.user.email))
                        console.log("OUNTER")
                        console.log(counter);
                        if (this.upvotes.includes(this.user.email)) {
                            this.upvoted[counter].value = true
                        }
                        else {
                            this.upvoted[counter].value = false
                        }
                        this.upvotes = []
                        counter += 1
                    })
                })
            })
        })
        localStorage.post_slug = this.$route.params.title_slug
    }
}
</script>

<style scoped>
.pinks {
  color: palevioletred;
}

.blacks {
  color: black;
}
.upVote {
    cursor: pointer;
    position:absolute;
    right: 25px;
    bottom: 5px;
}
.upvoted {
    position: absolute;
    right: 5px;
    bottom: 0px;
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
.reply-author {
    position: absolute;
    bottom: 5px;
    left:5px;
    font-size: 15px;
}
.body-text {
    color: gray;
    font-size: 15px;
    padding: 10px;
}
.card-content .thread-author {
    position: relative;
    bottom: -23px;
    left: -30px;
    color: gray;
    font-size: 15px;
    padding: 10px;
}
.messages-display {
    font-family: 'Montserrat', sans-serif;
}
.messages-display h2{
    font-size: 2.6em;
    margin-top: 0pc;
}
.messages-display ul{
    text-align: left;
}
.card {
    margin-bottom: 50px;
    padding: 20px;
}
.card-content{
    font-size: 1.4em;
}
.thread-title {
    position: absolute;
    left: 10px;
    top: 3px;
    font-weight: bold;
    font-size: 23px;
}
.time{
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