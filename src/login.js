const googleSignInBtn = document.getElementById('googleSignInBtn');
const loginAsGuest = document.getElementById('guestBtn');
const emailAuthForm = document.getElementById('emailAuthForm');
const authButton = document.getElementById('authButton');
const toggleButton = document.getElementById('toggleButton');
const profilePic = document.getElementById('profile-pic');
const loadingScreen = document.getElementById('loading');
const currentTime = firebase.firestore.FieldValue.serverTimestamp();

let isLoginMode = true;

const updateUI = (isLoggedIn, username = '', email = '', isAdmin = false) => {
    document.getElementById('login-screen').style.display = isLoggedIn ? 'none' : 'block';
    document.getElementById('main-menu').style.display = isLoggedIn ? 'block' : 'none';
    document.getElementById('admin-page-button').style.display = isAdmin ? 'block' : 'none';

    if (isLoggedIn) {
        let displayName = username || email || 'User';
        if (email == "guestuser@gmail.com") displayName = "Guest";
        document.getElementById("welcome").textContent = `Welcome ${displayName}!`;
        document.querySelector('nav').style.display = 'flex';

        loadingScreen.style.opacity = '0';
        loadingScreen.style.pointerEvents = 'none';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 1000);
    } else {
        document.querySelector('nav').style.display = 'none';
        loadingScreen.style.opacity = '0';
        loadingScreen.style.pointerEvents = 'none';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 1000);
    }
};

const getUserData = (user) => {
    return firebase.firestore().collection('users').doc(user.uid).get()
        .then((doc) => doc.exists ? doc.data() : null);
};

const setUser = (user, userData) => {
    const userRef = firebase.firestore().collection('users').doc(user.uid);

    const userDataToSet = {
        username: user.displayName || 'Anonymous',
        email: user.email,
        lastLogin: currentTime,
        isAdmin: userData?.isAdmin || false
    };

    return userData
        ? userRef.update({ lastLogin: currentTime })
        : userRef.set(userDataToSet);
};

const handleUserSignIn = (user) => {
    getUserData(user).then((userData) => {
        setUser(user, userData).then(() => {
            updateUI(true, user.displayName, user.email, userData?.isAdmin || false);
            profilePic.src = user.photoURL || './assets/profile-pic.png';
            emailAuthForm.reset();
        }).catch((error) => console.error('Error updating user data:', error));
    }).catch((error) => console.error('Error fetching user data:', error));
};

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        handleUserSignIn(user);
    } else {
        updateUI(false);
    }
});

const handleEmailAuth = (email, password) => {
    const authMethod = isLoginMode
        ? firebase.auth().signInWithEmailAndPassword(email, password)
        : firebase.auth().createUserWithEmailAndPassword(email, password);

    authMethod.then((result) => {
        console.log(`${isLoginMode ? 'Logged in' : 'Registered'} with email:`, result.user);
        handleUserSignIn(result.user);
    }).catch((error) => {
        console.error(`Error during ${isLoginMode ? 'login' : 'registration'}:`, error);
        alert(error.message);
    });
};

toggleButton.addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    authButton.textContent = isLoginMode ? 'Login with Email' : 'Register with Email';
    toggleButton.textContent = isLoginMode ? 'Switch to Register' : 'Switch to Login';
});

emailAuthForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleEmailAuth(emailAuthForm.email.value, emailAuthForm.password.value);
});

googleSignInBtn.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then((result) => handleUserSignIn(result.user))
        .catch((error) => console.error(`Error during Google ${isLoginMode ? 'login' : 'registration'}:`, error));
});

loginAsGuest.addEventListener('click', () => {
    isLoginMode = true;
    handleEmailAuth("guestUser@gmail.com", "GuestPassword123");
});

const handleUserLogout = () => {
    firebase.auth().signOut()
        .then(() => updateUI(false))
        .catch((error) => console.error('Error signing out:', error));
};

loadingScreen.style.display = 'flex';
loadingScreen.style.opacity = '1';
