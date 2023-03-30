import React, {useState} from 'react';

export default function AuthForm({register, login}) {

  const [fieldUsername, setFieldUsername] = useState('');
  const [fieldPassword, setFieldPassword] = useState('');

  function handleUsernameChange(event) {
    setFieldUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setFieldPassword(event.target.value);
  }

  return(
    <div id="login-form">
      <label id="login-username">
        <p>Username</p>
        <input type="text" name="username" value={fieldUsername} onChange={handleUsernameChange} required />
      </label>
      <label id="login-password">
        <p>Password</p>
        <input type="password" name="password" value={fieldPassword} onChange={handlePasswordChange} required />
      </label>
      <br />
      
      <div id="submit-buttons">
        <input onClick={() => register(fieldUsername, fieldPassword)} type="submit" value="Register" />
        <input onClick={() => login(fieldUsername, fieldPassword)} type="submit" value="Login" />
      </div>
    </div>
  )
}