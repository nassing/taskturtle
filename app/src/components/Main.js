import React, {useState} from 'react';

import App from './App';
import AuthPage from './auth/AuthPage';
import Cookies from 'js-cookie';

export default function Main() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const getUser = (_token) => {
    fetch('http://localhost:4859/getUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({token: _token})
      })
      .then(response => {
        if (response.ok) {
          return response.json();          
          } else {
            console.log('Something went wrong ...');
          }
        })
        .then(data => {
          setUsername(data.username);
          setLoggedIn(true);
        })
        .catch(error => console.log(error.message));
  }

  const autologin = () => {
    if(Cookies.get('token') === undefined) {
      return;
    }
    const isGuest = Cookies.get('isGuest');
    if(isGuest)
    {
      const guestToken = Cookies.get('token');
      getUser(guestToken);
    }
  }

  const login = (_id, _isGuest) => {
    autologin();
  }

  const register = (_token, _isGuest) => {
    if(_isGuest)
    {
      fetch('http://localhost:4859/guestRegister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({token: _token})
      })
      .then(response => {
        if (response.ok) {
          response.text().then(text => {
            if(text === "") {
              Cookies.set('isGuest', "true", { expires: 7 });
              Cookies.set('token', _token, { expires: 7 });
              autologin(_token, true);
            }
            else
            {
              console.log(text);
            }
          })
        }
      })
      .catch(error => console.log(error.message));
    }
    else
    {
      //Verify token signature, and if it's verified:
      // Cookies.set('isGuest', false, { expires: 7 })
      // Cookies.set('token', _token, { expires: 7 });
    }
  }

  const generateToken = () => {
    let token = '';
    for (let i = 0; i < 32; i++) {
      token += Math.floor(Math.random() * 16).toString(16); // generates random hex number
    }
    return token;
  };

  const registerAsGuest = () => {
    console.log(Cookies.get('isGuest'));
    if(Cookies.get('token') === undefined || Cookies.get('isGuest') === "false")
    {
      register(generateToken(), true)
    }
    else if(Cookies.get('isGuest') === "true")
    {
      autologin();
    }
  }

  const logout = () => {
    setUsername('');
    setLoggedIn(false);
  }

  if(!loggedIn) {
    return (
      <AuthPage register={register} registerAsGuest={registerAsGuest} login={login} />
    );
  } else {
    return (
      <App username={username} logout={logout}/>
    )
  }

  // return (
  //   <App username={username} logout={logout} />
  // );
  
}