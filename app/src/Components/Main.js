import React, {useState} from 'react';

import AuthPage from './Auth/AuthPage';
import App from './components/App';

export default function AuthPage() {

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