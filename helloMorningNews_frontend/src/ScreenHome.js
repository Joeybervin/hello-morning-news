import React, { useState } from 'react';
import './App.css';
// ^ Module Antd Design
import { Input, Button, Icon, message , notification} from 'antd';
// ^ Module router
import {Redirect} from 'react-router-dom';
// ^ Module redux
import { connect } from 'react-redux';

function ScreenHome(props) {
  // * ________________________ VARIABLES & VARIABLES D'ÉTAT ________________________
  /* sign-up variables */
  const [signUpUsername, setSignUpUsername] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [errorSignUp, setErrorSignUp] = useState(false)

  /* sign-in variables */
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')
  const [errorSignIn, setErrorSignIn] = useState(false)

  /* Login variable condition */
  const [login, setLogin] = useState(false)

  /* Message et Icon d'erreur */
  let errorSignInMessage , errorSignInIcon ;
  let errorSignUpnMessage , errorSignUpIcon ;



  // * ________________________ FUNCTIONS ________________________

  const openNotification = (placement) => {
    notification.open({
      message: `Bonjour ${placement}`,
      description:
        'Te voilà connecté à ton application, félicitation !! Je suis ravie de te revoir sur notre plateforme. \n Bonne journée à toi.',
        icon: <Icon type="smile" style={{ color: '#FFAE00' }}/>,placement
    });
  };

  /* Pour se connecter  */
  const signIn = async () => {
    /* requête à mon back-end */
    const rawResponse = await fetch('/sign-in', {
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `signInEmailFront=${signInEmail}&signInPasswordFront=${signInPassword}&`,
    })
    let response = await rawResponse.json()
    if (response.alreadyMember === true) {/* Si nous retrouvons le user dans la base de données */
      
      props.storeTheUser(response.user)/* J'envoie toutes les infos du compte de mon utilisateur à  mon store */
      props.addToWishList(response.user.articlelist)/* J'envoie la wishlist de la base de sonnées de mon utilisateur au store */
      setLogin(true)
      openNotification(response.user.username)
    }
    else { /* Si nous ne retrouvons pas le user : message erreur, vidage de input*/
      setErrorSignIn(true);
      setSignInEmail("");
      setSignInPassword("");
      //? Message d'erreur 1 : TOP
      message.error('Ce compte n\'existe pas !'); 
    }
  }
  if(errorSignIn) {//? Message d'erreur 2 : BOTTOM
    errorSignInMessage = " ERROR"
    errorSignInIcon =  <Icon type="exclamation-circle"/>
  }

  /* Pour créer un nouvelle utilisateur */
  const signUp = async () => {
    const rawResponse = await fetch('/sign-up', {
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `signUpUsername=${signUpUsername}&signUpEmail=${signUpEmail}&signUpPassword=${signUpPassword}`,
    })
    let response = await rawResponse.json()

    
    if (response.alreadyMember === true) { // Si l'utilisateur n'existe pas 
      
      props.storeTheUser(response.user)/* J'envoie toutes les infos du compte de mon utilisateur à  mon store */
      props.addToWishList(response.user.articlelist) /* J'envoie la wishlist de la base de sonnées de mon utilisateur au store */
      openNotification(response.user.username) /* Message de connexion */
      setLogin(true)
    }
    /* Si l'utilisateur existe ou que les champs sont vide */
    else {
      
      if (signUpUsername === "" || signUpEmail === "" || signUpPassword === "") {// ? Si l'un des champs est vide
        setErrorSignUp(true)
      }
      
      else { // ? Si l'utilisateur est déjà présent dans notre base de données
        setSignInEmail(signUpEmail)
        setErrorSignUp(true)
    
        message.error('Cet email existe déjà dans notre base de données / Tous les champs sont obligatoires');  //? Message d'erreur 1 : TOP
      }
      setSignUpUsername("")
      setSignUpEmail("")
      setSignUpPassword("")
      
    }
  }
  if(errorSignUp) {//? Message d'erreur 2 : BOTTOM
    errorSignUpnMessage = "ERROR !"
    errorSignUpIcon =  <Icon type="exclamation-circle" />
  }

  // * ________________________ MA PAGE ________________________
  if (login) {
    return  <Redirect to="/ScreenSource" /> 

  }
  else {
    return (
      <div className="Login-page" >
  
        {/* SIGN-IN */}
  
        <div className="Sign">
          <h2 style={{color:"white"}}>Sign-in</h2>
  
          <Input className="Login-input" placeholder="mail@mail.com"
            onChange={(e) => setSignInEmail(e.target.value)} value={signInEmail} />
  
          <Input.Password className="Login-input" placeholder="password"
            onChange={(e) => setSignInPassword(e.target.value)} value={signInPassword} />

            <p style={{color:"red"}}>{errorSignInIcon}{errorSignInMessage}</p>
  
  
          <Button onClick={() => signIn()} style={{ width: '80px' }} type="primary">Sign-in</Button>
  
        </div>
  
        {/* SIGN-UP */}
  
        <div className="Sign">

        <h2 style={{color:"white"}}>Sign-up</h2>
  
          {/* USERNAME */}
          <Input className="Login-input" placeholder="username"
            onChange={(e) => setSignUpUsername(e.target.value)} value={signUpUsername} />
  
          {/* EMAIL */}
          <Input className="Login-input" placeholder="mail@mail.com"
            onChange={(e) => setSignUpEmail(e.target.value)} value={signUpEmail} />
  
          {/* password */}
          <Input.Password className="Login-input" placeholder="password"
            onChange={(e) => setSignUpPassword(e.target.value)} value={signUpPassword} />
  
           <p style={{color:"red"}}>{errorSignUpIcon}{errorSignUpnMessage}</p>
          
  
          <Button onClick={() => signUp()} style={{ width: '80px' }} type="primary">Sign-up</Button>
  
        </div>
  
      </div>
    );

  }

 
}

// * ________________________ REDUX ________________________
function mapDispatchToProps(dispatch) {
  return {
    storeTheUser: function(user) {
        dispatch( {type: 'storeUser', user } )
        
    },
    addToWishList: function(article) {
      dispatch( {type: 'addArticle', article } )
      
  }
  }
 }
 

export default connect(
  null,
  mapDispatchToProps
)(ScreenHome);

