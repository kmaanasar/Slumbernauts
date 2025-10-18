// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_ID",
    appId: "YOUR_APP_ID"
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