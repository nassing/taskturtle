// Composant pour afficher le nom de l'appli

import React from 'react';

import logo from '../../images/logo.png';

export default function Title() {

  return(
    <div className="title">
      <img src={logo} alt="logo" style={{height: "5rem"}}></img>
      <h1>TaskTurtle</h1>
    </div>
  )
}