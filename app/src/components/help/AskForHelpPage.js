import React, {useEffect, useState} from 'react';
import Web3 from 'web3';
import TaskTurtle from '../../contracts/TaskTurtle.abi.json';

export default function AskForHelpPage({ username }) {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskLocation, setTaskLocation] = useState('');
  const [taskReward, setTaskReward] = useState('');
  const [contractAddresses, setContractAddresses] = useState([]);
  const [userPKeys, setUserPKeys] = useState('');
  const [taskContract, setTaskContract] = useState(null);
  const [balance, setBalance] = useState(0);
  const [userAdr, setUserAdr] = useState('');

  const web3 = new Web3('http://localhost:9545');

  const submitTask = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    console.log('Available Addresses:', accounts);
    try {
      const reward = parseInt(taskReward);
      if(balance >= reward) {
        const gas = await taskContract.methods.createTask(reward,taskDescription).estimateGas({ from: userAdr.slice(-40) });
        const result = await taskContract.methods.createTask(reward,taskDescription).send({ from: userAdr.slice(-40), gas });
        console.log('Task created:', result);
      }
      else {
        console.log("Balance isn't high enough");
      }  
    } catch (error) {
      console.error('Error accepting task:', error);
    }
  }


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
            setBalance(data.balance);
            setUserAdr(data.address);
            setUserPKeys(data.p_keys);
            // web3.eth.accounts.wallet.add(data.p_keys);
            // const account = web3.eth.accounts.wallet.add(data.p_keys);
        })
        .catch(error => console.log(error.message));
        
    }

    

    
  return (
    <>
      <h1>Ask For Help</h1>
      <form className="help-form" onSubmit={submitTask}>
        <label>
          Description:
          <input type="text" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} />
        </label>
        <label>
          Reward:
          <input type="text" value={taskReward} onChange={(e) => setTaskReward(e.target.value)} pattern="[0-9]*"/>
        </label>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
