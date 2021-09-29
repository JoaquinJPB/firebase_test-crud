// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";
import {getDatabase, ref, set, get, child, update, remove} from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js'

const firebaseConfig = {
    apiKey: "AIzaSyBwMd8d6AIQCwaL38LzrVBQG7DodBE7VRY",
    authDomain: "fb-test-users-7ca98.firebaseapp.com",
    projectId: "fb-test-users-7ca98",
    storageBucket: "fb-test-users-7ca98.appspot.com",
    messagingSenderId: "603698055719",
    appId: "1:603698055719:web:5f0cc4830c38579ba59c02",
    measurementId: "G-PLJ6PS4L6L"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase();


// Variables & Const
const email = document.querySelector('#signup-email').value;
const password = document.querySelector('#signup-password').value;
var idUser;

function getLastId() {
    const dbref = ref(database);
    get(child(dbref,"Users/")).then((snapshot) => {
        if(snapshot.exists()){
            idUser = snapshot.val().length - 1;
        } else{
            alert("No se han encontrado los datos del usuario");
        }
    })
    .catch((error) => {
        alert("Ha ocurrido un error"+error);
    });
}

getLastId();
// Database

// Insert data function
function insertData(e){
    e.preventDefault();
    const fullName = document.getElementById('signup-name').value + " " + document.getElementById('signup-surname').value; 
    const email = document.querySelector('#signup-email').value;
    idUser++;
    set(ref(database, "Users/"+idUser),{
        userName: fullName,
        userEmail: email
    })
    .then(() => {
        signupForm.reset();
        $('#signupModal').modal('hide');
        alert("Datos guardados correctamente");
    })
    .catch((error) => {
        alert("Ha ocurrido un error"+error);
    })
}

// Select data function
function selectData() {
    const dbref = ref(database);

    get(child(dbref,"Users/"+idUser)).then((snapshot) => {
        if(snapshot.exists()){
            document.getElementById('userName').innerHTML = snapshot.val().userName;
            document.getElementById('userEmail').innerHTML = snapshot.val().userEmail;
        } else{
            alert("No se han encontrado los datos del usuario");
        }
    })
    .catch((error) => {
        alert("Ha ocurrido un error"+error);
    });
}

const userData = document.getElementById('data');
userData.addEventListener('click',selectData);

// Log In
const signinForm = document.querySelector('#login-form');

signinForm.addEventListener('submit', e => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            signinForm.reset();
            $('#signinModal').modal('hide');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
})

// Sign Up
const signupForm = document.querySelector('#signup-form');

signupForm.addEventListener('submit', insertData);

    /*
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            signupForm.reset();
            $('#signupModal').modal('hide');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    */

// Logout 
const logout = document.querySelector('#logout');

logout.addEventListener('click', e => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log('Sign Out');
    })
})

// Delete User Account



// Modify User Account



/*
// Users
const postList = document.querySelector('.posts');
const setupPosts = data => {
    if (data.length){
        let html = '';
        data.forEach(doc => {
            const post_data = doc.data();
            const li = `
                <li class="list-group-item list-group-item-action">
                    <h5>${post_data.title}</h5>
                    <p><${post_description.description}/p>
                </li>
            `;
            html += li;
        })
        postList.innerHTML = html;
    } else{
        postList.innerHTML = '<p class="text-center">Login to see</p>'
    }
}


// Events
auth.onAuthStateChanged(user => {
    if (user) {
        const querySnapshot = await getDocs(collection(db, "posts"));
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
        });
        setupPosts(querySnapshot);
    } else {
        console.log('Auth: Sing out');
    }
});


*/