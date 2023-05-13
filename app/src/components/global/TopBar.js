//Composant pour la navbar, classique

import React from 'react';

export default function TopBar({username, logout, setPage, parentPage, balance}) {
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
        <div className="log-out" onClick={() => logout()}>
          <p>Log out</p>
        </div>
      </div>
    </div>
  )
}