import React, {useState} from 'react';

import AuthTitle from './AuthTitle';
import AuthForm from './AuthForm';

export default function AuthPage({register, login}) {

  return(
    <>
      <AuthTitle />
      <AuthForm />
    </>
  )
}