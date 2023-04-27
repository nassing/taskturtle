import React, { useState } from 'react';

import Title from '../global/Title';

export default function AuthPage({register, registerAsGuest, login}) {

  const [fieldUsername, setFieldUsername] = useState('');
  const [fieldPassword, setFieldPassword] = useState('');

  const handleUsernameChange = (event) => {
    setFieldUsername(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setFieldPassword(event.target.value);
  }

  return(
    <>

      <Title />
      <h1>Ask for help and get paid for helping !</h1>

      <div className="login">
        <div className="login-form">
          <label className="login-username">
            <p>Username</p>
            <input type="text" name="username" value={fieldUsername} onChange={handleUsernameChange} required />
          </label>
          <label className="login-password">
            <p>Password</p>
            <input type="password" name="password" value={fieldPassword} onChange={handlePasswordChange} required />
          </label>
          <div className="submit-buttons">
            <input onClick={() => register(fieldUsername, fieldPassword)} type="submit" value="Register" />
            <input onClick={() => login(fieldUsername, fieldPassword)} type="submit" value="Login" />
          </div>
        </div>

        <div onClick={() => registerAsGuest()} className="guest-login">
          <p>Continue as guest</p>
        </div>
      </div>
    </>
  )
}