import app from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

import * as firebaseui from 'firebaseui';

class Firebase {
  initializeApp = (env) => {
    var config = {
      apiKey:             process.env["REACT_APP_" + env + "_FIREBASE_API_KEY"],
      authDomain:         process.env["REACT_APP_" + env + "_FIREBASE_AUTH_DOMAIN"],
      databaseURL:        process.env["REACT_APP_" + env + "_FIREBASE_DB_URL"],
      projectId:          process.env["REACT_APP_" + env + "_FIREBASE_PROJECT_ID"],
      storageBucket:      process.env["REACT_APP_" + env + "_FIREBASE_STORAGE_BUCKET"],
      messagingSenderId:  process.env["REACT_APP_" + env + "_FIREBASE_MESSAGING_SENDER"]
    };

    app.initializeApp(config);

    this.auth =               app.auth();
    this.recaptchaVerifier =  app.auth.RecaptchaVerifier;
    this.signInUi =           null;
  }

  logout = () => this.auth.signOut()

  getSignInUi = (id, onSuccess) => {
    // FirebaseUI config.
    var uiConfig = {
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: 'popup',
      signInSuccessUrl: '/',
      signInOptions: [
        app.auth.PhoneAuthProvider.PROVIDER_ID
      ],
      // tosUrl and privacyPolicyUrl accept either url string or a callback function.
      // Terms of service url/callback.
      tosUrl: '/',
      // Privacy policy url/callback.
      privacyPolicyUrl: () => {
        alert('Privacy Policy not available');
      },
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          var user = authResult.user;
          var credential = authResult.credential;
          var isNewUser = authResult.additionalUserInfo.isNewUser;
          var operationType = authResult.operationType;

          this.userData = { user, credential, isNewUser, operationType };
          // Do something with the returned AuthResult.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          return false;
        }
      }
    };

    if(this.signInUi)
      return this.signInUi;

    this.signInUi = new firebaseui.auth.AuthUI(this.auth);
    this.signInUi.start(id, uiConfig);

    return this.signInUi;
  }

  onAuthStateChanged = (callback) => {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        user.getIdToken().then((accessToken) => {
          this.userData = {
            displayName: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified,
            phoneNumber: user.phoneNumber,
            photoURL: user.photoURL,
            uid: user.uid,
            accessToken: accessToken,
            providerData: user.providerData,
            creationTime: user.metadata ? user.metadata.creationTime : ''
          }
          callback(this.userData)
        })
      } else {
        // User is signed out.
        this.userData = null
        callback(this.userData)
      }
    }, (error) => {
      this.userData = null
      callback(this.userData)
    });
  }

  getTokenFromRecaptchaVerifier(id, callback) {
    var captcha = new this.recaptchaVerifier(id, {
        'size': 'normal',
        'callback': function(token) {
            if(callback)
              callback(token);
        },
        'expired-callback': function() {
            if(callback)
             callback(null);
        }
    });

    captcha.render().then(function() {
        captcha.verify();
    });
  }
}

export default Firebase;
