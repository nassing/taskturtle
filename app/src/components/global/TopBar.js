import React from 'react';

export default function TopBar({username, logout, setPage, parentPage}) {
  return (
    <div className="top-bar">
      <p>Hello {username} !</p>

      <div className="top-bar-right">
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