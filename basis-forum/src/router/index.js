import Vue from 'vue'
import Router from 'vue-router'
import ThreadsDisplay from '@/components/ThreadsDisplay'
import MessagesDisplay from '@/components/MessagesDisplay'
import AddPost from '@/components/AddPost'
import Login from '@/components/Login'
import firebase from 'firebase'

Vue.use(Router)

const router = new Router({
  
  routes: [
    {
      path: '/',
      name: 'ThreadsDisplay',
      component: ThreadsDisplay
    },
    {
      path: '/messages/:title_slug',
      name: 'MessagesDisplay',
      component: MessagesDisplay,
    },
    {
      path: '/addpost/',
      name: 'AddPost',
      component: AddPost,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})

router.beforeEach((to, from, next) => {
  // check to see if route requires auth
  if(to.matched.some(rec => rec.meta.requiresAuth)){
    // check auth state of user
    let user = firebase.auth().currentUser
    console.log('user: '+user)
    if(user){
      // user signed in, proceed to route
      next()
    } else {
      // no user signed in, redirect to login
      next({ name: 'Login' })
    }
  } else {
    next()
  }
})

export default router