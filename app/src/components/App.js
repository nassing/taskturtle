// Composant principal qui render la page en fonction de la variable PAGE.

import React, {useState} from 'react';

import Title from './global/Title';
import PageSelection from './global/PageSelection';
import HelpPage from './help/HelpPage';
import AskForHelpPage from './help/AskForHelpPage';
import ProfilePage from './profile/ProfilePage';
import TopBar from './global/TopBar';
import Transaction from './transactions/Transaction';

import {PAGE} from './global/Enums';

export default function App({username, balance, logout, giveMoney, getUser, setBalance}) {

  const [currentPage, setCurrentPage] = useState(PAGE.APP);
  const [transactionID, setTransactionID] = useState(0);

  function setPage(_page) {
    if(_page === PAGE.HELP || _page === PAGE.ASKFORHELP || _page === PAGE.PROFILE)
    {
      setCurrentPage(_page);
    }
    else
    {
      setCurrentPage(PAGE.APP);
    }
  }

  if(currentPage === PAGE.HELP) {
    return(
      <>
        <TopBar username={username} balance={balance} logout={logout} setPage={setPage} parentPage={PAGE.APP} currPage={PAGE.HELP} />
        <Title />
        <HelpPage username={username} getUser={getUser} setTransactionID={setTransactionID} setCurrentPage={setCurrentPage} setBalanceG={setBalance}/>
      </>
    )
  } else if(currentPage === PAGE.ASKFORHELP) {
    return(
      <>
        <TopBar username={username} balance={balance} logout={logout} setPage={setPage} parentPage={PAGE.APP}  currPage = {PAGE.ASKFORHELP}/>
        <Title />
        <AskForHelpPage username={username} setBalanceG={setBalance}/>
      </>
    )
  
  } else if(currentPage === PAGE.PROFILE) {
    return(
      <>
        <TopBar username={username} balance={balance} logout={logout} setPage={setPage} parentPage={PAGE.APP}  currPage = {PAGE.PROFILE}/>
        <Title />
        <ProfilePage username={username} setBalanceG={setBalance}/>
      </>
    )
  } else if(currentPage === PAGE.TRANSACTION) {
    return(
      <>
        <TopBar username={username} balance={balance} logout={logout} setPage={setPage} parentPage={PAGE.APP}  currPage = {PAGE.TRANSACTION}/>
        <Title />
        <Transaction username={username} transactionID={transactionID}/>
      </>
    )
  } else {
    return(
      <>
        <TopBar username={username} balance={balance} logout={logout} setPage={setPage}  currPage = {PAGE.APP}/>
        <Title />
        <PageSelection setPage={setPage} giveMoney={giveMoney} />
      </>
    )
  }

}