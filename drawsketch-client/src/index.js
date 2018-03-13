import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter } from "react-router-dom";
import './style/index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import promiseFinally from 'promise.prototype.finally';

import authStore from './stores/authStore';
import userStore from './stores/userStore';

const stores = {
  authStore,
  userStore
};

// For easier debugging
window._____APP_STATE_____ = stores;

promiseFinally.shim();
useStrict(true);

ReactDOM.render((
  <Provider {...stores}>
    <BrowserRouter>
      <Route component={App} />
    </BrowserRouter>
  </Provider>), document.getElementById('root'));
registerServiceWorker();
