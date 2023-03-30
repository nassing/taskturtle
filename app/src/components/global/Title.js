import React, {useState} from 'react';

import logo from '../../images/logo.png';

export default function Title() {

  return(
    <div class="title">
      <img src={logo} style={{height: "5rem"}}></img>
      <h1>TaskTurtle</h1>
    </div>
  )
}