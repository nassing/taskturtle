//Page pour demander de l'aide

import React, {useState} from 'react';
import defaultImage from './bear.jpg';

export default function ProfilePage({username}) {

  const [photoLink, setPhotoLink] = useState('');
  const [balance, setBalance] = useState(0);
  
  

  function handleSubmit() { 
    console.log("entering handleSubmit");

    const data = {
      username: username,
    };

    fetch('http://localhost:4859/getProfile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
        } else {
          console.log('Something went wrong ...');
        }
      })
      .then(data => {
        setPhotoLink(data.link);
        setBalance(data.balance);
      })
      .catch(error => console.log(error.message));
  }


  return(
  <>
    <div className='profile-frame'>
      <div className='profile-title-frame'>
        <h1 className='profile-title profile-elt' >Profile</h1>
        <div className='profile-img-frame profile-elt'>
          <img className='profile-img' src={photoLink===''? defaultImage : photoLink} ></img>
        </div>
      </div>
     
      <div className='profile-elt' > Welcome {username} !</div>
      
      <div className='profile-elt' > Here is your balance : {balance} </div>
    </div>
  </>
  )
}
