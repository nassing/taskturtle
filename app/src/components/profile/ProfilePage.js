//Page pour demander de l'aide

import React, {useEffect, useState} from 'react';
import defaultImage from './bear.jpg';
import Web3 from 'web3';
import TaskTurtle from '../../contracts/TaskTurtle.abi.json';


export default function ProfilePage({username}) {

  const [contractAddresses, setContractAddresses] = useState([]);
  const [taskContract, setTaskContract] = useState(null);
  const [photoLink, setPhotoLink] = useState('');
  const [balance, setBalance] = useState(0);
  const [newLink,setNewLink] = useState('');
  const [imageExists, setImageExists] = useState(true);

  const web3 = new Web3('http://localhost:9545');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/contractAddresses.txt');
        const fileContent = await response.text();
        const lines = fileContent.split('\n');
        const addresses = lines.map((line) => {
          const [contractName, contractAddress] = line.split(': ');
          return { contractName, contractAddress };
        });
        setContractAddresses(addresses);
      } catch (error) {
        console.error('Error fetching contract addresses:', error);
      }
    };
  
    fetchData();
  }, []);
  
  useEffect(() => {
    const taskAddress = contractAddresses.find(
      (contract) => contract.contractName === 'TaskTurtle'
    )?.contractAddress || 'None';
  
    if (taskAddress !== 'None') {
      const contractInstance = new web3.eth.Contract(TaskTurtle, taskAddress);
      setTaskContract(contractInstance);
    }
  }, [contractAddresses]);
  
  
  useEffect( () => {handleUpdate()}, []);
  useEffect( () => {setImageExists(true)},[photoLink])

  async function blockchainConnection() {
    if (taskContract) {
      const result = await taskContract.methods.sayHello().call();
      console.log(result);
    } else {
      console.log('Task contract is not initialized yet.');
    }
  }

  function handleImageError() {
    setImageExists(false);
  }

  function handleUpdate() { 
    //console.log("entering handleUpdate - ProfilePage");
   
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
          setImageExists(true);
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
    setPhotoLink(newLink);
    
    const data = {
      username: username,
      link : newLink,
    };
    setNewLink('');
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
  }
  
  //useEffect( () => {console.log(newLink)}, [newLink]);


  return(
  <>
    <div className='profile-frame'>
      <div className='profile-title-frame'>
        <h1 className='profile-title profile-elt' >Profile</h1>

        <div className='profile-img-frame profile-elt'>
          {imageExists ? (
            <img className='profile-img' src={photoLink} onError={handleImageError} />
            ) : (
              <img className='profile-img' src={defaultImage} />
           )}

        </div>

        <form className="help-form" onSubmit={handleSubmitProfile}>
          <label>
            New Photo Link:
            <input type="text" value={newLink} onChange={e => setNewLink(e.target.value)} />
          </label>
          <input className="input-submit" type="submit" value="Submit" />
        </form>

      </div>
     
      <div className='profile-elt' > Welcome {username} !</div>
      
      <div className='profile-elt' > Here is your balance : {balance} </div>
      <button className='profile-elt' onClick={blockchainConnection} > Click me!  </button>
    </div>
  </>
  )
}
