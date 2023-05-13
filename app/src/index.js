// C'est ici qu'on import tous les fichiers css

import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import Main from './components/Main';

import './css/index.css';
import './css/Title.css';
import './css/AuthPage.css';
import './css/TopBar.css';
import './css/PageSelection.css';
import './css/TaskList.css';
import './css/AskForHelp.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);

reportWebVitals();
