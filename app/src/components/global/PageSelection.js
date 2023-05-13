// Composant modifie la variable PAGE pour choisir la page sur laquelle on veut aller

import React from 'react';

import { PAGE } from './Enums';

export default function PageSelection({ setPage, giveMoney }) {
  return (
    <div className="page-selection">
      <div className="page-selection-button" onClick={() => setPage(PAGE.HELP)}>
        <p>Help</p>
      </div>
      <div className="page-selection-button" onClick={() => setPage(PAGE.ASKFORHELP)}>
        <p>Ask for Help</p>
      </div>
      <div className="page-selection-button" onClick={() => giveMoney()}>
        <p> Give me money !</p>
      </div>
    </div>
  );
}
