// Firebase Configuration
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import {
    getAnalytics
} from "https://www.gstatic.com/firebasejs/9.1.0/firebase-analytics.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    deleteUser,
    updateEmail,
    updatePassword
} from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";
import {
    getDatabase,
    ref,
    set,
    get,
    child,
    update,
    remove
} from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js'

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
const auth = getAuth();

var idUser;

function getLastId() {
    const dbref = ref(database);
    get(child(dbref, "Users/")).then((snapshot) => {
            if (snapshot.exists()) {
                idUser = snapshot.val().length - 1;
            } else {
                idUser = 0;
            }
        })
        .catch((error) => {
            alert("Ha ocurrido un error" + error);
        });
}

getLastId();

/* ************************ INSERT DATA IN DATABASE & SIGN UP ************************ */
function insertData(e) {
    e.preventDefault();
    const fullName = document.getElementById('signup-name').value + " " + document.getElementById('signup-surname').value;
    const email = document.querySelector('#signup-email').value;
    const password = document.querySelector('#signup-password').value;
    idUser++;
    set(ref(database, "Users/" + idUser), {
            id: idUser,
            userName: fullName,
            userEmail: email
        })
        .then(() => {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    signupForm.reset();
                    $('#signupModal').modal('hide');
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                });
            alert("Datos guardados correctamente");
        })
        .catch((error) => {
            alert("Ha ocurrido un error" + error);
        })
}

const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', insertData);

/* ************************ SIGN IN & SELECT DATA FROM DATABASE ************************ */
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.querySelector('#login-email').value;
    const password = document.querySelector('#login-password').value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Has iniciado sesión");
            asyncCall(email).then((index) => {
                var idSession = index;
                selectData(idSession);
                loginForm.reset();
                $('#signinModal').modal('hide');
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
})

async function asyncCall(email) {
    try {
        let idSession = await getIdUser(email);
        return idSession;
    } catch (error) {
        alert("Ha ocurrido un error" + error);
    }
}

function getIdUser(email) {
    const dbref = ref(database);
    return new Promise((resolve, reject) => {
        for (let index = 1; index <= idUser; index++) {
            get(child(dbref, "Users/" + index)).then((snapshot) => {
                if (snapshot.val().userEmail == email) {
                    resolve(index);
                }
            });
        }
    })
}

function selectData(idSession) {
    const dbref = ref(database);
    get(child(dbref, "Users/" + idSession)).then((snapshot) => {
            if (snapshot.exists()) {
                document.getElementById('userName').innerHTML = snapshot.val().userName;
                document.getElementById('userEmail').innerHTML = snapshot.val().userEmail;
            } else {
                alert("No se han encontrado los datos del usuario");
            }
        })
    .catch((error) => {
        alert("Ha ocurrido un error" + error);
    });
}

const userData = document.getElementById('data');
userData.addEventListener('click', selectData);

/* ************************ UPDATE DATA USER ************************ */
function updateData() {
    const email = document.getElementById('userEmail').innerHTML;
    asyncCall(email).then((index) => {
        var idSession = index;
        update(ref(database, "Users/" + idSession), {
                userName: document.getElementById('exampleInputName1').value,
                userEmail: document.getElementById('exampleInputEmail1').value
            }).then(() => {
                asyncCallUserEmailUpdate().then(() => {
                    asyncCallUserPasswordUpdate().then(() => {
                        console.log("Datos actualizados");
                    })  
                })
                alert("Los datos han sido modificados correctamente");
                document.getElementsByClassName('data_content')[0].style.display = "none";
                selectData(idSession);
            })
            .catch((error) => {
                alert("Ha ocurrido un error" + error);
            });
    });
}

async function asyncCallUserEmailUpdate(){
    try {
        return updateUserEmail();
    } catch (error) {
        alert("Ha ocurrido un error" + error);
    }
}

async function asyncCallUserPasswordUpdate(){
    try {
        return updateUserPassword();
    } catch (error) {
        alert("Ha ocurrido un error" + error);
    }
}

function updateUserEmail() {
    return new Promise((resolve, reject) => {
        resolve(
            updateEmail(auth.currentUser, document.getElementById('exampleInputEmail1').value)
            .then(() => {
                console.log("Email actualizado "+ document.getElementById('exampleInputEmail1').value)
            })
        );
    });
}

function updateUserPassword() {
    return new Promise((resolve, reject) => {
        resolve(
            updatePassword(auth.currentUser, document.getElementById('exampleInputPassword1').value)
            .then(() => {
                console.log("Password actualizado "+ document.getElementById('exampleInputPassword1').value);
            })
        );
    });
}

document.getElementById('updateButton').addEventListener('click', () => {
        document.getElementsByClassName('data_content')[0].style.display = "initial";
        $('#dataModal').modal('hide');
        document.getElementById('exampleInputName1').value = document.getElementById('userName').innerHTML;
        document.getElementById('exampleInputEmail1').value = document.getElementById('userEmail').innerHTML;
});

document.getElementById('updateData').addEventListener('click', updateData);

/* ************************ DELETE ACCOUNT USER ************************ */
function deleteData() {
    remove(ref(database, "Users/" + idUser))
        .then(() => {
            deleteUser(auth.currentUser).then(() => {
                alert("Los datos han sido eliminados correctamente");
                $('#dataModal').modal('hide');
                document.getElementById('userName').innerHTML = "";
                document.getElementById('userEmail').innerHTML = "";
            })
        })
        .catch((error) => {
            alert("Ha ocurrido un error" + error);
        })
}

document.getElementById('deleteButton').addEventListener('click', deleteData);

/* ************************ LOGOUT USER ************************ */
logout.addEventListener('click', e => {
    e.preventDefault();
    auth.signOut().then(() => {
        document.getElementById('userName').innerHTML = "";
        document.getElementById('userEmail').innerHTML = "";
    })
});