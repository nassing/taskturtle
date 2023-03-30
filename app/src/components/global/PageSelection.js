import React, { useState } from 'react';

import { PAGE } from './Enums';

export default function PageSelection({ setPage }) {
  return (
    <>
      <button onClick={() => setPage(PAGE.HELP)}>Help</button>
      <button onClick={() => setPage(PAGE.ASKFORHELP)}>AskForHelp</button>
    </>
  );
}
