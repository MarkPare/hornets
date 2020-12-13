import React from 'react';
import ReactDOM from 'react-dom';
import './scss/index.scss';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from 'react-router-dom';

ReactDOM.render(
  <React.Fragment>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.Fragment>,
  document.getElementById('root')
);

serviceWorker.unregister();
