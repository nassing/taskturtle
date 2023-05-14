//Composant pour la navbar, classique

import React from 'react';
import {PAGE} from './Enums';

export default function TopBar({username, logout, setPage, parentPage, balance,currPage}) {
  return (
    <div className="top-bar">
      <p>Hello {username} !</p>

      <div className="top-bar-right">
      <div className="balance">
          <p>Balance: {balance} TTC</p>
      </div>
        { 
          parentPage ? 
          <div className="back" onClick={() => setPage(parentPage)}>
            <p>Back</p>
          </div> 
          : null
        }
        {  currPage !== PAGE.PROFILE ?
          <div className="profile" onClick={() => setPage(PAGE.PROFILE)}>
            <p>Profile</p>
          </div> 
          :null
        }
        <div className="log-out" onClick={() => logout()}>
          <p>Log out</p>
        </div>
      </div>
    </div>
  )
}