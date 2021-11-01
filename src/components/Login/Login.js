import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import '../Login/Login.css';
import { useContext, useState } from 'react';
import firebaseConfig from './firebase.config';
import { UserContext } from '../../App';
firebase.initializeApp(firebaseConfig);
function Login() {
const [newUser,setNewUser]=useState(false);


  const[user,setUser]= useState({
    isSignedIn: false,
    name:'',
    email:'',
    password:'',
    photo:'',
    error:''
  });

  const [loggedInUser,setLoggedInUser] = useContext(UserContext);
  console.log(user)
  // Google Sign IN
  const provider = new firebase.auth.GoogleAuthProvider();

  // Facebook Sign In

  const facebookProvider = new firebase.auth.FacebookAuthProvider();





  const handleSignIn = ()=>{
    // console.log("sign in clikced")
    firebase.auth().signInWithPopup(provider)
    .then(res=>{
      const {displayName,photoURL,email}= res.user;
      const signedInUser = {
        isSignedIn: true,
        name:displayName,
        email:email,
        photo:photoURL
      }
      setUser(signedInUser)
    })
    .catch(err=>{
      console.log(err);
      console.log(err.message);
    })
  }



  const handleSignOut=()=>{
      firebase.auth().signOut()
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
      setUser(signedOutUser);
      })
      .catch(err =>{

      })
  }





    const handleBlur = (event)=>{
    console.log(event.target.name,event.target.value);
    let isFieldValid = true;
    if(event.target.name === 'email'){
      
      // eslint-disable-next-line no-unused-vars
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
      
    }

    if (event.target.name === 'password'){
        const isPasswordValid = event.target.value.length > 6;
        const passwordHasNumber = /\d{1}/.test(event.target.value);
        isFieldValid = isPasswordValid && passwordHasNumber;
    }

    if(isFieldValid){
        const newUserInfo = {...user};
        newUserInfo[event.target.name] = event.target.value;
        setUser(newUserInfo);
    }

    }






const handleSubmit = (e)=>{
  console.log(user.email,user.password)
  if(newUser && user.email && user.password){
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .then(res=>{
      console.log(res);
      const newUserInfo = res.user;
      newUserInfo.error = '';
      newUserInfo.success= true;
      setUser(newUserInfo);
      updateUserName(user.name);
      console.log(user.name)
      
    })
  .catch(error => {
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.success= false;
    setUser(newUserInfo);
    
    console.log(error,error.message);
    // var errorCode = error.code;
    // var errorMessage = error.message;
    // console.log(errorCode,errorMessage)
    // ..
  });
  }
  if(!newUser && user.email && user.password){
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then(res=>{
    const newUserInfo = {...user};
      newUserInfo.error = '';
      newUserInfo.success= true;
      setUser(newUserInfo);
      setLoggedInUser(newUserInfo);
      console.log('sign in user info',res.user)
  })
  .catch((error) => {
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.success= false;
    setUser(newUserInfo);
  });
  }
  e.preventDefault();
}


const handleFacebookSignIn = ()=>{
  firebase
  .auth()
  .signInWithPopup(facebookProvider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // The signed-in user info.
    var user = result.user;
    console.log("fb sign in worked",user)

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var accessToken = credential.accessToken;

    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    // ...
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

  return (
    <div className="Login">
     {
       user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> :
       <button onClick={handleSignIn}>Google Sign In</button>
       }
       <br />
       <button onClick={handleFacebookSignIn}>Sign In with Facebook</button>
     {
       user.isSignedIn && <div>
       <p>Welcome, {user.name}</p>
       <p>Email:{user.email}</p>
       <img src={user.photo} alt="" />
       </div>
     } 

     <h1>Our OWN Authentication</h1>
     <input type="checkbox" onChange={()=>setNewUser(!newUser)} name="newUser" id=""/>
     <label htmlFor="newUser">New User Sign up</label>
     <form onSubmit={handleSubmit}>
      
     { newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Your Name"/>}
     <br/>
     <input type="email" onBlur={handleBlur} name="email" placeholder="Your Email" required/><br/>
     <input type="password" onBlur={handleBlur}  name="password" placeholder="Your Password" required/><br/>
     <input type="submit" value={newUser ? "Sign Up" : "Sign In"} />
     </form>

     <p style={{color:'red'}}>{user.error}</p>
     
     {user.success && <p style={{color:'green'}}>User {newUser ? 'Created' : 'Logged In'} Successfully</p>}

    </div>
  );
}

export default Login;