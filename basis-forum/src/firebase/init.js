import firebase from 'firebase'
import firestore from 'firebase/firestore'
var firebaseConfig = {
    apiKey: "AIzaSyDNftUxU1AdAUpYthFNDZF4hfIq2PaefKE",
    authDomain: "basis-forum.firebaseapp.com",
    databaseURL: "https://basis-forum.firebaseio.com",
    projectId: "basis-forum",
    storageBucket: "basis-forum.appspot.com",
    messagingSenderId: "1001652224865",
    appId: "1:1001652224865:web:90566ada325b953913fb20",
    measurementId: "G-WKJPB491Q2"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig); 
firebaseApp.firestore().settings({})

//export firestore database
export default firebaseApp.firestore()