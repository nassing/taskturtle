import React, {useState, useEffect} from 'react';

import { TRANSACTIONSTATE } from "../global/Enums";

export default function Transaction({username, transactionID}) {

  const [senderUsername, setSenderUsername] = useState('');
  const [receiverUsername, setReceiverUsername] = useState('');
  const [senderPictureLink, setSenderPictureLink] = useState('');
  const [receiverPictureLink, setReceiverPictureLink] = useState('');
  const [transactionState, setTransactionState] = useState(null);
  const [transactionPrice, setTransactionPrice] = useState(0);
  const [serviceTitle, setServiceTitle] = useState(0);

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
        setSenderUsername(data.senderUsername);
        setReceiverUsername(data.receiverUsername);
        setSenderPictureLink(data.senderPictureLink);
        setReceiverPictureLink(data.receiverPictureLink);
        setTransactionState(data.transactionState);
        setTransactionPrice(data.transactionPrice);
        setServiceTitle(data.serviceTitle);
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
    <>
      <div className="sender">
        <img alt="sender-picture-link" src={senderPictureLink}/>
        <p>{senderUsername}</p>
      </div>

      <div className="transaction">
        <p className="service-title">{serviceTitle}</p>
        <p className="transaction-price">{transactionPrice}</p>
        { transactionState === TRANSACTIONSTATE.PENDING && senderUsername === username ? (
          <button className="confirm-transaction">Pay</button>) 
          : null }
        { transactionState === TRANSACTIONSTATE.PENDING && receiverUsername === username ? (
          <button className="cancel-help">Cancel</button>)
          : null }
        { transactionState === TRANSACTIONSTATE.PENDING && receiverUsername === null ? (
          <button className="accept-help">Help</button>)
          : null }
      </div>

      {
        receiverUsername === null ? (
          <div className="receiver">
            <p>Waiting for a helper...</p>
          </div>
        ) : (
          <div className="receiver">
            <img alt="receiver-picture-link" src={receiverPictureLink}></img>
            <p>{receiverUsername}</p>
          </div>
        )
      }

    </>
  )
}