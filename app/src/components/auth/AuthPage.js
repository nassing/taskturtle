import React, { useState } from 'react';

import Title from '../global/Title';

export default function AuthPage({register, registerAsGuest, login}) {

  return(
    <>
      <Title />
      <h1>Ask for help and get paid for helping !</h1>

      <div className="guest-login">
        <p> Continue with Auth0 </p>
      </div>

      <div onClick={() => registerAsGuest()} className="guest-login">
        <p>Continue as guest</p>
      </div>
    </>
  )
}