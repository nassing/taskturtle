import React, {useEffect, useState} from 'react';
import defaultImage from './bear.jpg';
import Web3 from 'web3';
import TaskTurtle from '../../contracts/TaskTurtle.abi.json';


export default function ProfilePage({username}) {

  const [contractAddresses, setContractAddresses] = useState([]);
  const [taskContract, setTaskContract] = useState(null);
  const [photoLink, setPhotoLink] = useState('');
  const [balance, setBalance] = useState(0);
  const [userAdr, setUserAdr] = useState('');
  const [userPKeys, setUserPKeys] = useState('');
  const [newLink,setNewLink] = useState('');
  const [newKeys,setNewKeys] = useState('');
  const [imageExists, setImageExists] = useState(true);

  const [ongoinsTasks, setOngoingTasks] = useState([]);
  const [acceptedTasks, setAcceptedTasks] = useState([]);

  const web3 = new Web3('http://localhost:9545');

  // On récupère les adresses de tous les contrats deploy sur Truffle
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
  
  // On récupère l'adresse du contrat TaskTurtle, et on génère l'instance du contrat
  useEffect(() => {
    const taskAddress = contractAddresses.find(
      (contract) => contract.contractName === 'TaskTurtle'
    )?.contractAddress || 'None';
  
    if (taskAddress !== 'None') {
      const contractInstance = new web3.eth.Contract(TaskTurtle, taskAddress);
      setTaskContract(contractInstance);
    }
  }, [contractAddresses]);
  
  
  useEffect( () => {handleUpdate();}, []);
  useEffect( () => {setImageExists(true)},[photoLink])
  useEffect( () => {getTaskLists();}, [taskContract]);


  // On call la fonction du contrat !
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
          setUserAdr(data.address);
          setUserPKeys(data.p_keys);
          web3.eth.accounts.wallet.add(data.p_keys);
          const account = web3.eth.accounts.wallet.add(data.p_keys);

          if (account !== null) {
            // Account was successfully unlocked
            console.log('Account unlocked:', account.address);
          } else {
            // Failed to unlock the account
            console.log('Failed to unlock account');
          }
        }
        else {
          setPhotoLink('');
          setBalance(0);
          setUserAdr(data.address);
          setUserPKeys(data.p_keys);
          const account = web3.eth.accounts.wallet.add(data.p_keys);

          if (account !== null) {
            // Account was successfully unlocked
            console.log('Account unlocked:', account.address);
          } else {
            // Failed to unlock the account
            console.log('Failed to unlock account');
}
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

  const handleSubmitKeys = async (e) => {
    e.preventDefault();
    
    
    const validAddressFormat = /^0x[a-fA-F0-9]{64}$/;
    if (!validAddressFormat.test(newKeys)) {
      console.log("Invalid keys format. Good format is Ox... followed by a 64-long hex.");
      return;
    }
    setUserAdr('0x'+newKeys.slice(-40));
    const data = {
      username: username,
      p_keys : newKeys,
    };
    setNewLink('');
    fetch('http://localhost:4859/submitNewKeys', {
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
  
  
  //Updating both tasklist on entry of the page :;

  async function getTaskLists() {
    if (taskContract) {
      const result = await taskContract.methods.getTasks().call();
      setAcceptedTasks([]);
      setOngoingTasks([]);
      for(let item of result) {
        if(item.requester === userAdr && !(item.completed)) {
          setOngoingTasks(ongoinsTasks => [...ongoinsTasks, {id: item.id, requester: item.requester, desc: item.desc, performer: item.performer,  price: item.price, completed : item.completed, accepted: item.accepted}]);
        }
        else if (item.performer === userAdr && !(item.completed)) {
          setAcceptedTasks(acceptedTasks => [...acceptedTasks, {id: item.id, requester: item.requester, desc: item.desc, performer: item.performer,  price: item.price, completed : item.completed, accepted: item.accepted}]);
        }
      }
      
    } else {
      console.log('Task contract is not initialized yet.');
    }
  }


  async function completeAcceptedTask(taskId, senderAddress, price) {
    try {
      const result = await taskContract.methods.acceptTask(taskId).send({ from: senderAddress, price });
      console.log('Task accepted:', result);
    } catch (error) {
      console.error('Error accepting task:', error);
    }
  }

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
          <input className="input-submit profile-button" type="submit" value="Submit" />
        </form>

      </div>
     
      <div className='profile-elt' > Welcome {username} !</div>
      
      <div className='profile-elt' > Here is your balance : {balance} </div>
      <div className='profile-elt' > Here is your address : {userAdr} </div>
      <form className="help-form profile-elt" onSubmit={handleSubmitKeys}>
          <label>
            Modify your private keys (Ox...):
            <input type="text" value={newKeys} onChange={e => setNewKeys(e.target.value)} />
          </label>
          <input className="input-submit profile-button" type="submit" value="Submit" />
        </form>
    </div>
    <div className='profile-title profile-elt profile-margin-top'> My Tasks </div>         
    

    <div className='profile-contract-frame' >

          <div className="profile-task-list">
            {acceptedTasks.map((task, index) => (
              <div className="profile-task" key={index}>
                <div className='profile-task-header'>
                  <div className='profile-task-elt'> Task id: {task.id} </div>
                  <div className='profile-task-elt'>  Status: {task.accepted? (task.completed? "Completed" : "Accepted"): "Not accepted "} </div>
                 
                </div> 
                <div className='profile-task-body'>
                  <div className='profile-task-elt'> From: {task.requester} </div>
                  {task.accepted?<div className='profile-task-elt'> Accepted by: {task.performer} </div>:null}
                  <div className='profile-task-elt'> Price : {task.price} </div>
                  <div className='profile-task-elt'> {task.desc} </div>
                  <button className='profile-task-elt profile-task-button' onClick={() => completeAcceptedTask(task.id,userAdr,task.price)}>  Finish Task </button>
                </div>
              </div>
            ))}
          </div>

          <div className="profile-task-list">
            {ongoinsTasks.map((task, index) => (
              <div className="profile-task" key={index}>
                <div className='profile-task-header'>
                  <div className='profile-task-elt'> Task id: {task.id} </div>
                  <div className='profile-task-elt'>  Status: {task.accepted? (task.completed? "Completed" : "Accepted"): "Not accepted "} </div>
                </div> 
                <div className='profile-task-body'>
                  <div className='profile-task-elt'> From: {task.requester} </div>
                  {task.accepted?<div className='profile-task-elt'> Accepted by: {task.performer} </div>:null} 
                  <div className='profile-task-elt'> Price : {task.price} </div>
                  <div className='profile-task-elt'> {task.desc} </div>
                </div>
            </div>
            ))}
           </div>

    </div>
  </>

  
  )
}
