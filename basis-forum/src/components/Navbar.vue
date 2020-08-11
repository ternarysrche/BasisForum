<template>
  <div class="navbar">
    <nav class="grey darken-2">
      <div class="container">
        <div class="nav-content">
          <a class="title">
            <router-link :to="{ name: 'ThreadsDisplay' }">BIF Forum</router-link>
          </a>
          <ul class="right">
            <li v-if="!user">
              <router-link :to="{ name: 'Login' }">Login</router-link>
            </li>
            <li v-if="user"> <a>{{ user.email }}</a></li>
            <li v-if="user"> <a @click="logout">Logout</a></li>
          </ul> 
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Navbar',
  data () {
    return {
      user: null,
    }
  },
  methods: {
    logout(){
      firebase.auth().signOut().then(() => {
        this.$router.push({ name: 'Login' })
      })
    }
  },
  created(){
        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                this.user = user
            } else {
                this.user = null
            }
        })
    }
}
</script>


<style>
.navbar {
  height: 80px;
  font-family: 'Montserrat', sans-serif;
  font-size: 30px;
}
</style>
