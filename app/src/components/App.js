import React, {useState} from 'react';

import Title from './global/Title';
import PageSelection from './global/PageSelection';
import HelpPage from './help/HelpPage';
import AskForHelpPage from './askForHelp/AskForHelpPage';

import { PAGE } from './global/Enums';

export default function App() {

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
        <Title />
        <HelpPage />
      </>
    )
  } else if(currentPage === PAGE.ASKFORHELP) {
    return(
      <>
        <Title />
        <AskForHelpPage />
      </>
    )
  } else {
    return(
      <>
        <Title />
        <PageSelection setPage={setPage}/>
      </>
    )
  }

}