import React, {useState} from 'react';

import App from './App';
import AuthPage from './auth/AuthPage';

export default function Main() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  function login(_username, _password) {
    //ToDo
    setUsername(_username);
    setLoggedIn(true);
  }

  function register(_username, _password) {
    //ToDo
    setUsername(_username);
    setLoggedIn(true);
  }

  function logout() {
    setUsername('');
    setLoggedIn(false);
  }
  

  if(!loggedIn) {
    return (
      <AuthPage register={register} login={login}/>
    );
  } else {
    return (
      <App username={username} logout={logout}/>
    )
  }
  
}