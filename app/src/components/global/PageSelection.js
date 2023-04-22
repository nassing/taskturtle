import React from 'react';

import { PAGE } from './Enums';

export default function PageSelection({ setPage }) {
  return (
    <div className="page-selection">
      <div className="page-selection-button" onClick={() => setPage(PAGE.HELP)}>
        <p>Help</p>
      </div>
      <div className="page-selection-button" onClick={() => setPage(PAGE.ASKFORHELP)}>
        <p>AskForHelp</p>
      </div>
    </div>
  );
}
