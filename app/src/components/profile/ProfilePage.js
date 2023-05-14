//Page pour demander de l'aide

import React, {useEffect, useState} from 'react';
import defaultImage from './bear.jpg';

export default function ProfilePage({username}) {

  const [photoLink, setPhotoLink] = useState('');
  const [balance, setBalance] = useState(0);
  const [newLink,setNewLink] = useState('');
  
  useEffect( () => {handleUpdate()}, []);

  function handleUpdate() { 
    console.log("entering handleUpdate - ProfilePage");

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
        if ('link' in data) {
          setPhotoLink(data.link);
          setBalance(data.balance);
          setNewLink('');
        }
        else {
          setPhotoLink('');
          setBalance(0);
        }
      })
      .catch(error => console.log(error.message));
      
  }

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    const data = {
      username: username,
      link : newLink,
    };

    fetch('http://localhost:4859/submitNewLink', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        response.text().then(text => {
          if(text === "") {
            console.log("Link updated successfully");
          }
          else
          {
            console.log(text);
          }
        })
      }
    })
    .catch(error => console.log(error.message));
    handleUpdate();
  }
  
  //useEffect( () => {console.log(newLink)}, [newLink]);


  return(
  <>
    <div className='profile-frame'>
      <div className='profile-title-frame'>
        <h1 className='profile-title profile-elt' >Profile</h1>

        <div className='profile-img-frame profile-elt'>
          <img className='profile-img' src={photoLink===''? defaultImage : photoLink} ></img>
        </div>

        <form className="help-form" onSubmit={handleSubmitProfile}>
          <label>
            New Photo Link:
            <input type="text" value={newLink} onChange={e => setNewLink(e.target.value)} />
          </label>
          <input type="submit" value="Submit" />
        </form>

      </div>
     
      <div className='profile-elt' > Welcome {username} !</div>
      
      <div className='profile-elt' > Here is your balance : {balance} </div>
    </div>
  </>
  )
}
