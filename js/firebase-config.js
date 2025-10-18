// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSCIB9EQaCP3JAyKuvQVhhg08Yo8XIRJ0",
  authDomain: "slumbernaut-478f7.firebaseapp.com",
  projectId: "slumbernaut-478f7",
  storageBucket: "slumbernaut-478f7.firebasestorage.app",
  messagingSenderId: "144635906857",
  appId: "1:144635906857:web:84a4aa5b29a4f622a48538"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Generate or retrieve user ID
function getUserId() {
    let userId = localStorage.getItem('sleepspace_user_id');
    if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('sleepspace_user_id', userId);
    }
    return userId;
}

// Get or create username
function getUsername() {
    let username = localStorage.getItem('sleepspace_username');
    if (!username) {
        username = prompt('Enter your username:') || 'Anonymous';
        localStorage.setItem('sleepspace_username', username);
    }
    return username;
}

const currentUserId = getUserId();
const currentUsername = getUsername();