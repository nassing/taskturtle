//Contient la plupart des variables et des fonctions. Affiche la page d'authentification si on n'est pas connecté et App sinon

import React, {useState} from 'react';

import App from './App';
import AuthPage from './auth/AuthPage';
import Cookies from 'js-cookie';
import Web3 from 'web3';
import { SocketBlockSubscriber } from 'ethers';

export default function Main() {


  const web3 = new Web3('http://localhost:9545');

  let accounts;

  const fetchAccounts = async () => {
    try {
      accounts = await web3.eth.getAccounts();
      //console.log('Accounts:', accounts);
      // Use the 'accounts' variable for further processing
    } catch (error) {
      console.error('Error getting accounts:', error);
    }
  };
  
  // Call the fetchAccounts function
  fetchAccounts();

  let account_count = 0;

  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [balance, setBalance] = useState(0);

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
          if(data.error && data.error === "User not found") {
            register(Cookies.get('token'), true);
            getUser(Cookies.get('token'));
          }
          setUsername(data.username);
          setBalance(data.balance);
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
    { //console.log(accounts);
      const account_addr = accounts[account_count];
      account_count +=1;
      if (account_count>= accounts.length) {
        account_count =0;
      }
      fetch('http://localhost:4859/guestRegister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({token: _token, address: account_addr})
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

  const giveMoney = () => {
    console.log("test");
    fetch('http://localhost:4859/giveMoney', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: username, amount:100})
      })
      .then(response => {
        if (response.ok) {
          return response.json();
          } else {
            console.log('Something went wrong ...');
          }
        })
        .then(data => {
          console.log(data);
          setBalance(data.balance);
        })
        .catch(error => console.log(error.message));
      }

  if(!loggedIn) {
    return (
      <AuthPage register={register} registerAsGuest={registerAsGuest} login={login} />
    );
  } else {
    return (
      <App username={username} balance={balance} logout={logout} giveMoney={giveMoney} getUser={getUser} setBalance={setBalance} />
    )
  }
  
}