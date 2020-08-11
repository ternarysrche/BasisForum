<template>
        <div>
            <label class="newMsg" for="new-message">New Message (enter to add)</label>
                <!-- Form -->
            <v-form @submit.prevent="addReply">
                    <!-- Inputs -->
                        <!-- Message --> 
                        <!-- Backend add shift-enter new line function -->
                        <v-textarea class="body" style="max-width:178vh" height=100px outlined label="Body" @keydown.enter.prevent="addReply" v-model="body"></v-textarea>
                    <!-- Bottom Submit -->
            
                        <!-- Send Button -->
                            <v-card-actions>
                                <v-btn depressed class="green lighten-1 replyBtn" type="submit">Reply</v-btn>
                            </v-card-actions>
                    <!-- Clear -->
            </v-form>
        </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import slugify from 'slugify'
export default {
    name: 'PostReply',
    data() {
        return {
            title: null,
            body: null,
            slug: null,
            another: null,
            user: null,
            feedback: null
        }
    },
    methods: {
        addReply(){
            db.collection('post-replies').add({
                title: this.title,
                body: this.body,
                post_slug: localStorage.post_slug,
                author: this.user,
                timestamp: Date.now()
            }).then(() => {
                this.$router.go()
            }).catch(err => {
                console.log(err)
                this.feedback = err.message
            })
            this.title = null
            this.body = null
            // let ref = db.collection('post-replies').doc()
            // ref.get()
            // .then(() => {
            //     ref.set({
            //         reply: this.newReply,
            //         user: this.user,
            //         timestamp: Date.now()
            //     })
            //     this.newReply = null
            // })
            // .catch(err => {
            //     this.feedback = err.message
            // })
            // this.feedback = null
        },
    },
    beforeMount(){
        let user = firebase.auth().onAuthStateChanged((user) => {
            if(user){
                this.user = user.email
            } else {
                this.user = null
            }
        })
    }
}
</script>

<style scoped>
.newMsg, .body{
    margin-left: 30px;
}
.body{
    padding-top: 15px;
}
.newMsg{
    position: relative;
    top: 10px;
}
</style>