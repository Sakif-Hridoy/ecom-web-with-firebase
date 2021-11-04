import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import firebaseConfig from './firebase.config';

export const initializeLoginFramework = () => {
    if(firebase.apps.length ===0){
      firebase.initializeApp(firebaseConfig);
    }
}

export const handleGoogleSignIn = ()=>{
    // console.log("sign in clikced")
const provider = new firebase.auth.GoogleAuthProvider();
return firebase.auth().signInWithPopup(provider)
    .then(res=>{
      const {displayName,photoURL,email}= res.user;
      const signedInUser = {
        isSignedIn: true,
        name:displayName,
        email:email,
        photo:photoURL,
        success:true
      }
       return signedInUser;
    })
    .catch(err=>{
      console.log(err);
      console.log(err.message);
    })
  }



export const handleGoogleSignOut=()=>{
    return  firebase.auth().signOut()
      .then(res=>{
          const signedOutUser = {
            newUser:false,
            isSignedIn:false,
            name:'',
            photo:'',
            email:'',
            error:'',
            success:false
          }
    return signedOutUser;
      })
      .catch(err =>{

      })
  }
// export const handleFacebookSignIn = ()=>{
//     const facebookProvider = new firebase.auth.FacebookAuthProvider();
//     firebase
//     .auth()
//     .signInWithPopup(facebookProvider)
//     .then((result) => {
//       /** @type {firebase.auth.OAuthCredential} */
//       var credential = result.credential;
  
//       // The signed-in user info.
//       var user = result.user;
//       console.log("fb sign in worked",user)
  
//       // This gives you a Facebook Access Token. You can use it to access the Facebook API.
//       var accessToken = credential.accessToken;
  
//       // ...
//     })
//     .catch((error) => {
//       // Handle Errors here.
//       var errorCode = error.code;
//       var errorMessage = error.message;
//       // The email of the user's account used.
//       var email = error.email;
//       // The firebase.auth.AuthCredential type that was used.
//       var credential = error.credential;
  
//       // ...
//     });
//   }

  
export const createUserWithEmailAndPassword = (name,email,password)=>{
return firebase.auth().createUserWithEmailAndPassword(email,password)
        .then(res=>{
          console.log(res);
          const newUserInfo = res.user; /*check here if any error*/
          newUserInfo.error = '';
          newUserInfo.success= true;
          updateUserName(name);
          return newUserInfo;
          
        })
      .catch(error => {
        const newUserInfo = {};
        newUserInfo.error = error.message;
        newUserInfo.success= false;
        return newUserInfo;
        // console.log(error,error.message);
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // console.log(errorCode,errorMessage)
        // ..
      });
}


export const signInWithEmailAndPassword = (email,password)=>{
  return firebase.auth().signInWithEmailAndPassword(email,password)
      .then(res=>{
        const newUserInfo = res.user;
          newUserInfo.error = '';
          newUserInfo.success= true;
          return newUserInfo;
      })
      .catch((error) => {
        const newUserInfo = {};
        newUserInfo.error = error.message;
        newUserInfo.success= false;
        return newUserInfo;
      });
}

const updateUserName = name =>{
    console.log(name)
    const user = firebase.auth().currentUser;
  
      user.updateProfile({
        displayName: name
        
    
    }).then((result) => {
      // Update successful
      // ...
      console.log(result,"user name updated Successfully")
    }).catch((error) => {
      // An error occurred
      // ...
      console.log(error)
    });  
    }
  