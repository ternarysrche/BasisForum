<template>
    <div class="login container">
        <form @submit.prevent='login' class="card-panel">
            <h2 class="center grey-text text-darken-3">Login</h2>
            <div class="field">
                <label for="email">Email</label>
                <input type="email" name="email" v-model="email">
            </div>
            <div class="field">
                <label for="password">Password</label>
                <input type="password" name="password" v-model="password">
            </div>
            <p v-if="feedback" class="red-text center">{{ feedback }}</p>
            <div class="field center">
                <button class="btn grey darken-2">Login</button>
            </div>  
        </form>
    </div>
</template>

<script>
import firebase from 'firebase'

export default {
    data(){
        return{
            feedback: null,
            email: null,
            password: null,
        }
    },
    methods: {
        login(){
            if(this.email && this.password){
                this.feedback=null
                firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                .then(() => {
                    this.$router.push({ name: 'ThreadsDisplay' })
                    var user = firebase.auth().currentUser;
                    var email = user.email
                    console.log(email);
                })
                .catch(err => {
                    this.feedback = err.message
                })
            } else {
                this.feedback = "You must enter all fields."
            }
        }
    }
}
</script>

<style>
.login {
    max-width: 400px;
    margin-top: 60px;
}
.login h2 {
    font-size: 40px;
    margin-top: 10px;
}
.login button {
    margin-top: 30px;
}
</style>