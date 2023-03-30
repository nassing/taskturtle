import React, {useState} from 'react';

import Title from '../global/Title';
import AuthForm from './AuthForm';

export default function AuthPage({register, login}) {

  return(
    <>
      <Title />
      <AuthForm register={register} login={login}/>
    </>
  )
}