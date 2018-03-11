import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import './style/index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import promiseFinally from 'promise.prototype.finally';

import authStore from './stores/authStore';
import userStore from './stores/userStore';
import commonStore from './stores/commonStore';

const stores = {
  authStore,
  commonStore,
  userStore
};

// For easier debugging
window._____APP_STATE_____ = stores;

promiseFinally.shim();
useStrict(true);

ReactDOM.render((
  <Provider {...stores}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>), document.getElementById('root'));
registerServiceWorker();
