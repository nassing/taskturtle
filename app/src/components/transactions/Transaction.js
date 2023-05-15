import React, {useState, useEffect} from 'react';

import { TRANSACTIONSTATE } from "../global/Enums";

export default function Transaction({username, transactionID}) {

  const [senderUsername, setSenderUsername] = useState('');
  const [receiverUsername, setReceiverUsername] = useState('');
  const [senderPictureLink, setSenderPictureLink] = useState('');
  const [receiverPictureLink, setReceiverPictureLink] = useState('');
  const [transactionState, setTransactionState] = useState(null);
  const [transactionPrice, setTransactionPrice] = useState(0);
  const [taskTitle, setTaskTitle] = useState('');

  const getTransactionData = () => {
    fetch('http://localhost:4859/getTransactionData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({transactionID: transactionID})
      })
    .then(response => {
      if (response.ok) {
        return response.json();
        } else {
          console.log('Something went wrong ...');
        }
      })
      .then(data => {
        console.log(data);
        setSenderUsername(data.senderUsername);
        setReceiverUsername(data.receiverUsername);
        setSenderPictureLink(data.senderPictureLink);
        setReceiverPictureLink(data.receiverPictureLink);
        setTransactionState(data.transactionState);
        setTransactionPrice(data.transactionPrice);
        setTaskTitle(data.taskTitle);
      })
      .catch(error => console.log(error.message));
  }

  const tryTransaction = () => {
    fetch('http://localhost:4859/tryTransaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({transactionID: transactionID, username: username})
      })
    .then(response => {
      if (response.ok) {
        return response.json();
        } else {
          console.log('Something went wrong ...');
        }
      })
      .then(data => {
        // ToDO:
      })
      .catch(error => console.log(error.message));
  }

  useEffect(() => {
    getTransactionData();
  }, []);

  return(
    <div className="transaction-page">
      <h1>{taskTitle}</h1>
      <div className="transaction-info">
        <div className="sender">
          <p>Sender</p>
          <div className="profile-img-frame">
            <img className="profile-img" alt="sender-picture-link" src={senderPictureLink}/>
          </div>
          <p>{senderUsername}</p>
        </div>

        <div className="transaction">
          <p className="service-title">{taskTitle}</p>
          <p className="transaction-price">Price: {transactionPrice}</p>
          { transactionState === TRANSACTIONSTATE.PENDING && senderUsername === username ? (
            <button className="confirm-transaction">Pay</button>) 
            : null }
          { transactionState === TRANSACTIONSTATE.PENDING && receiverUsername === username ? (
            <button className="cancel-help">Cancel</button>)
            : null }
        </div>

        {
          transactionState === TRANSACTIONSTATE.PENDING && receiverUsername === null ? (
            <div className="receiver">
              <p>Waiting for a helper...</p>
              <button className="accept-help">Help</button>
            </div>
          ) : (
            <div className="receiver">
              <div className="profile-img-frame">
                <img className="profile-img" alt="sender-picture-link" src={receiverPictureLink}/>
              </div>
              <p>{receiverUsername}</p>
            </div>
          )
        }
      </div>
    </div>
  )
}