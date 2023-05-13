import React, {useState} from react;

import { TRANSACTIONSTATE } from "../global/Enums";

export default function Transaction({userToken, transactionID}) {

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
        setTransactionState(data.transactionPrice);
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
        body: JSON.stringify({transactionID: transactionID, userToken: userToken})
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

  return(
    <>
      <div className="sender">
        <img src={senderPictureLink}/>
        <p>{senderUsername}</p>
      </div>

      <div className="transaction">
        <p className="service-title">{serviceTitle}</p>
        <p className="transaction-price">{transactionPrice}</p>
        { transactionState == TRANSACTIONSTATE.PENDING && username == senderUsername ? (<button className="confirm-transaction"></button>) : null }
      </div>

      <div className="receiver">
        <img src={receiverPictureLink}></img>
        <p>{receiverUsername}</p>
      </div>
    </>
  )
}