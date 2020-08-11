<template>
    <div class="postreply">
        <!-- Form -->
        <form @submit.prevent="addReply">
            <!-- Inputs -->
            <!-- Message --> 
            <div class="px30"></div>
            <div class="addPost-form" style="width: 800px; justify-content: space-around;">
                <div class="col-xs-6 wow animated slideInRight" >
                        <!-- Message -->
                        <textarea name="message" id="message" class="form textarea" style="border:solid 4px gray; border-radius: 10px"  placeholder="New Post" v-model="body"></textarea>
                    </div>
            </div>
            <!-- Bottom Submit -->
            <!-- Send Button -->
            <div class="px30"></div>
            <div class="px30"></div>
            <span class="submit-area">
                <p class='red-text' v-if="feedback" style="margin-bottom: 10px;">{{ feedback }}</p>
                    <btn class="btn-large red center" type="submit" @click="addReply">Reply</btn>

            </span>
            <!-- Clear -->
        </form>
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
            body: null,
            slug: null,
            another: null,
            user: null,
            feedback: null
        }
    },
    methods: {
        addReply(){
            if(this.body){
            db.collection('post-replies').add({
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
            this.feedback = null
            } else {
                this.feedback = "You must enter a message"
            }
        },
    },
    beforeCreate(){
        console.log("POST REPLY")
    },
    beforeMount(){
        let user = firebase.auth().onAuthStateChanged((user) => {
            if(user){
                this.user = user.email
            } else {
                this.$router.push({ name: 'Login'})
            }
        })
    }
}
</script>

<style scoped>
.px30 {
    height: 30px;
}
.center {
  margin: 0;
  position: absolute;
  bottom: 0px;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.newMsg, .body{
    margin-left: 30px;
}
.body{
    padding-top: 10px;
    margin-bottom: 5px;
}
.submit-area {
    margin: 0 auto; 
}
.postreply {
    font-family: 'Montserrat', sans-serif;
}
.form{
  width: 100%;
  padding: 15px;
  background:#f8f8f8;
  border:1px solid rgba(0, 0, 0, 0.075);
  margin-bottom:25px;
  color:#727272 !important;
  font-size:13px;
  -webkit-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;
}
.form:hover{
  border:1px solid #8BC3A3;
}
.form:focus{
  color: white;
  outline: none;
  border:1px solid #8BC3A3;
}
.textarea{
  height: 200px;
  max-height: 200px;
  max-width: 100%;
}
</style>