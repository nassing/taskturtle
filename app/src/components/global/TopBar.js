import React from 'react';

export default function TopBar({username, logout, setPage, parentPage}) {
  return (
    <div class="top-bar">
      <p>Hello {username} !</p>

      <div class="top-bar-right">
        { 
          parentPage ? 
          <div class="back" onClick={() => setPage(parentPage)}>
            <p>Back</p>
          </div> 
          : null
        }
        <div class="log-out" onClick={() => logout()}>
          <p>Log out</p>
        </div>
      </div>
    </div>
  )
}