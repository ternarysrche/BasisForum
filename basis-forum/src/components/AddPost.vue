<template>
    <div class = "add-post">
      <router-link :to="{ name: 'ThreadsDisplay' }">
            <btn class="btn-floating btn-large corner red" style="position: fixed">
                <i class="material-icons" @click="setEmail(user.email)">keyboard_backspace</i>
                <!-- <v-icon dark></v-icon> -->
            </btn>
        </router-link>
      <center>
        <div class="add-post card" style="width: 1000px">
            <div style="height: 30px"></div>
            <h4>New Post</h4>
            <!-- Form Area -->
            <div class="addPost-form col s12" style="width: 800px; justify-content: space-around;">
                <!-- Form -->
                <form id="addPost" method="post" action="#" @submit.prevent="AddPost">
                    <!-- Left Inputs -->
                    <div class="col-xs-6 wow animated slideInLeft" data-wow-delay=".5s">
                        <!-- Title -->
                      
                        <div class="row" style="margin: auto; display: block;">
                            <div class="input-field col s6">
                            <input id="name" type="text" class="form" v-model="title"/>
                            <label for="search">Title</label>
                            </div>
                        </div>
                        
                        <div style="height: 30px"></div>
                    </div>
                    <!-- Right Inputs -->
                    <div class="col-xs-6 wow animated slideInRight" >
                        <!-- Message -->
                        <textarea name="message" id="message" class="form textarea" style="border:solid 4px gray; border-radius: 10px"  placeholder="New Post" v-model="body"></textarea>
                    </div>
                    <!-- Bottom Submit -->
                    <p v-if="title||body" class="red-text text-lighten-2 center">{{ btnfeedback }}</p>
                    <div class="relative fullwidth col-xs-12">
                        <div v-if='!title&&!body' style="height: 30px"></div>
                        <!-- Send Button -->
                        <button type="submit" id="submit" style="cursor: pointer;" name="submit" class="form-btn semibold red">Add Post</button>
                        <div style="height: 40px"></div>
                    </div>
                    <!-- Clear -->
                    <div class="clear"></div>
                </form>
            </div><!-- End Contact Form Area -->
        </div><!-- End Inner -->
      </center>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import slugify from 'slugify'
import moment from 'moment'


export default {
    name: 'AddPost',
    data() {
        return {
            title: null,
            body: null,
            slug: null,
            another: null,
            user: null,
            feedback: null,
            btnfeedback: 'Your post draft will be deleted if you choose to go back',
        }
    },
    methods: {
        AddPost() {
            this.slug = slugify(this.title, {
                replacement: '-',
                remove: /[$*_+~.()'"!\-:@]/g,
                lower: true
            })
            db.collection('threads').add({
                title: this.title,
                body: this.body,
                slug: this.slug,
                author: this.user,
                timestamp: Date.now()
            // }).then(response => {
            //     response.ref.getDownloadURL().then((downloadURL) => {
            //     firebase.database().ref('images').child(this.slug).update({imageUrl:downloadURL})
            //     })
            }).then(() => {
                this.$router.push({ name: 'ThreadsDisplay'})
                console.log(moment(doc.data().timestamp).format('lll'))
            }).catch(err => {
                console.log(err)
                this.feedback = err.message
            })
            console.log(this.user)
        },
        deletionAlert() {
          if(this.title || this.body) {
            alert("Your post draft will be deleted")
          }
        }
    },
    beforeCreate(){
      console.log("entered ADD POST")
    },
    created(){
        let user = firebase.auth().onAuthStateChanged((user) => {
            //let email = user.email
            if(user) {
              this.user = user.email
            } else {
              this.user = null
            }
            console.log(this.user)
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
.icons {
  display: flex;
  padding-right: 30px;
}
#contact{
  padding:10px 0 10px;
}
.contact-text{
  margin:45px auto;
}
.mail-message-area{
  width:100%;
  padding:0 15px;
}
.mail-message{
  width: 100%;
  background:rgba(255,255,255, 0.8) !important;
  -webkit-transition: all 0.7s;
  -moz-transition: all 0.7s;
  transition: all 0.7s;
  margin:0 auto;
  border-radius: 0;
}
.not-visible-message{
  height:0px;
  opacity: 0;
}
.visible-message{
  height:auto;
  opacity: 1;
  margin:25px auto 0;
}

/* Input Styles */
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
.corner {
    position: absolute;
    bottom: 50px;
    right: 50px;
}
/* Generic Button Styles */
.button{
  padding:8px 12px;
  background:#0A5175;
  display: block;
  width:120px;
  margin:10px 0 0px 0;
  border-radius:3px;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
  text-align:center;
  font-size:0.8em;
  box-shadow: 0px 1px 4px rgba(0,0,0, 0.10);
  -moz-box-shadow: 0px 1px 4px rgba(0,0,0, 0.10);
  -webkit-box-shadow: 0px 1px 4px rgba(0,0,0, 0.10);
}
.button:hover{
  background:#8BC3A3;
  color:white;
}

/* Send Button Styles */
.form-btn{
  width:180px;
  display: block;
  height: auto;
  padding:15px;
  color:#fff;
  background:#8BC3A3;
  border:none;
  border-radius:3px;
  outline: none;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  transition: all 0.3s;
  margin:auto;
  box-shadow: 0px 1px 4px rgba(0,0,0, 0.10);
  -moz-box-shadow: 0px 1px 4px rgba(0,0,0, 0.10);
  -webkit-box-shadow: 0px 1px 4px rgba(0,0,0, 0.10);
}
.form-btn:hover{
  background:#111;
  color: white;
  border:none;
}
.form-btn:active{
  opacity: 0.9;
}
center{
  margin-top: 10px;
}
input {
  position: relative;
  z-index: 9999;
}
.op12 .op13{
  position: relative;
  bottom:150px;
  left:150px;
}
</style>

