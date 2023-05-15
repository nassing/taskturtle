//Page pour aider

import React, { useState, useEffect, useRef } from 'react';
import {PAGE} from '../global/Enums';
import Web3 from 'web3';
import TaskTurtle from '../../contracts/TaskTurtle.abi.json';
import { ethers } from "ethers";

export default function HelpPage({username, getUser, setTransactionID, setCurrentPage}) {

  const [taskList, setTaskList] = useState([]);
  const [contractAddresses, setContractAddresses] = useState([]);
  const [taskContract, setTaskContract] = useState(null);
  const [photoLink, setPhotoLink] = useState('');
  const [balance, setBalance] = useState(0);
  const [userAdr, setUserAdr] = useState('');
  const [userPKeys, setUserPKeys] = useState('');
  //userProfilePicture, taskImage, postDate, status

  const contractRef = useRef();
  contractRef.current = taskContract;

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
      
      contractRef.current = contractInstance;
      setTaskContract(contractInstance);

    }
  }, [contractAddresses]);

    //Updating both tasklist on entry of the page :;
    async function getTaskLists() {
      if (contractRef.current) {
        const taskData = await contractRef.current.methods.getTasks().call();
    
        const updatedTasks= [];
        
    
        taskData.forEach((item) => {
          //console.log("Item: ", item);
          if (!item[6]) {
            updatedTasks.push({
              id: item[0],
              requester: item[1],
              desc: item[5],
              performer: item[2],
              price: item[3],
              completed: item[4],
              accepted: item[6]
            });
          }
        });
        setTaskList(updatedTasks);
      } else {
        console.log('Task contract is not initialized yet.');
        //console.log(contractRef.current);
      }
    }
  
  useEffect( () => {handleUpdate();}, []);
  useEffect( () => {getTaskLists();}, [taskContract,userAdr]);

 //


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
          setUserAdr(data.address);
          setUserPKeys(data.p_keys);
          // web3.eth.accounts.wallet.add(data.p_keys);
          // const account = web3.eth.accounts.wallet.add(data.p_keys);

          // if (account !== null) {
          //   // Account was successfully unlocked
          //   console.log('Account unlocked:', account.address);
          //   console.log('Account address: '+ data.address);
          // } else {
          //   // Failed to unlock the account
          //   console.log('Failed to unlock account');
          // }
        }
        else {
          setPhotoLink('');
          setBalance(0);
          setUserAdr(data.address);
          setUserPKeys(data.p_keys);
          
          //const account = web3.eth.accounts.wallet.add(data.p_keys);
        }
      })
      .catch(error => console.log(error.message));
      
  }


  const completeTask = (id) => {
    fetch('http://localhost:4859/completeTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({task_id: id, helper_username: username})
    })
    .then(response => {
      if(response.ok) {
        response.text().then(text => {
          if(text === "") {
          //getTaskList();
          getUser();
        } else {
          console.log(response.text());
        }})
      } else {
        console.log('Something went wrong ...');
      }
    })
    .catch(error => console.log(error.message));
  }

  const goToTransactionPage = (id) => {
    setTransactionID(id);
    setCurrentPage(PAGE.TRANSACTION);
  }

  return(
    <>
      <div className="profile-task-list">
            <div className='profile-title'> Accepted Transactions </div>
            {taskList.map((task, index) => (
              <div className="profile-task" key={index}>
                <div className='profile-task-header'>
                  <div className='profile-task-elt-header'> Task id: {task.id} </div>
                  <div className='profile-task-elt-header'>  Status: {task.accepted? (task.completed? "Completed" : "Accepted"): "Not accepted "} </div>
                </div> 
                <div className='profile-task-body'>
                  <div className='profile-task-elt'> From: {task.requester} </div>
                  {task.accepted?<div className='profile-task-elt'> Accepted by: {task.performer} </div>:null}
                  <div className='profile-task-elt'> Price : {task.price} </div>
                  <div className='profile-task-elt'> {task.desc} </div>
                  <button className='profile-task-elt profile-task-button' onClick={() => completeTask(task.id)}>  Finish Task </button>
                </div>
              </div>
            ))}
          </div>
    </>
  );
}