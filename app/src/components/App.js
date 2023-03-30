import React, {useState} from 'react';

import Title from './global/Title';
import PageSelection from './global/PageSelection';
import HelpPage from './help/HelpPage';
import AskForHelpPage from './askForHelp/AskForHelpPage';
import TopBar from './global/TopBar';

import {PAGE} from './global/Enums';

export default function App({username, logout}) {

  const [currentPage, setCurrentPage] = useState(PAGE.APP);

  function setPage(_page) {
    if(_page === PAGE.HELP || _page === PAGE.ASKFORHELP)
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
        <TopBar username={username} logout={logout} setPage={setPage} parentPage={PAGE.APP} />
        <Title />
        <HelpPage />
      </>
    )
  } else if(currentPage === PAGE.ASKFORHELP) {
    return(
      <>
        <TopBar username={username} logout={logout} setPage={setPage} parentPage={PAGE.APP}/>
        <Title />
        <AskForHelpPage />
      </>
    )
  } else {
    return(
      <>
        <TopBar username={username} logout={logout} setPage={setPage} />
        <Title />
        <PageSelection setPage={setPage} />
      </>
    )
  }

}