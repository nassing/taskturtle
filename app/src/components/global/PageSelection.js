import React, { useState } from 'react';

import { PAGE } from './Enums';

export default function PageSelection({ setPage }) {
  return (
    <div class="page-selection">
      <div class="page-selection-button" onClick={() => setPage(PAGE.HELP)}>
        <p>Help</p>
      </div>
      <div class="page-selection-button" onClick={() => setPage(PAGE.ASKFORHELP)}>
        <p>AskForHelp</p>
      </div>
    </div>
  );
}
