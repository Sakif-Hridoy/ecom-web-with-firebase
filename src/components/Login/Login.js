import '../Login/Login.css';
import { useContext, useState } from 'react';

import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router';
import { createUserWithEmailAndPassword, handleGoogleSignIn, handleGoogleSignOut, initializeLoginFramework, signInWithEmailAndPassword } from './loginManager';



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
  initializeLoginFramework();
  const [loggedInUser,setLoggedInUser] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

 
  const googleSignIn = ()=>{
    handleGoogleSignIn()
    .then(res=>{
      handleResponse(res, true);
    })
  }

  const googleSignOut = ()=>{
    handleGoogleSignOut()
    .then(res=>{
      handleResponse(res, false);
    })
  }

  const handleResponse = (res,redirect)=>{
      setUser(res);
      setLoggedInUser(res);
      if(redirect){
        history.replace(from);
      }
      
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
        createUserWithEmailAndPassword(user.name,user.email,user.password)
        .then(res=>{
          handleResponse(res, true);
        })
      }

      if(!newUser && user.email && user.password){
        signInWithEmailAndPassword(user.email,user.password)
        .then(res=>{
          handleResponse(res, true);
        })
      }
      e.preventDefault();
    }


  return (
    <div className="Login">
     {
       user.isSignedIn ? <button className="signInOutBtn" onClick={googleSignOut}>Google Sign Out</button> :
       <button className="signInOutBtn" onClick={googleSignIn}>Google Sign In</button>
       }
       <br />
       {/* <button onClick={facebookSignIn}>Sign In with Facebook</button> */}
     {
       user.isSignedIn && <div>
       <p>Welcome, {user.name}</p>
       <p>Email:{user.email}</p>
       <img src={user.photo} alt="" />
       </div>
     } 

     <h1>Our OWN Authentication</h1>
     <input type="checkbox" onChange={()=>setNewUser(!newUser)} name="newUser" id=""/><label htmlFor="newUser">New User Sign up</label>
     
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