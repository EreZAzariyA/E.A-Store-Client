import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './redux/store';
import { App } from './App';
import interceptorsService from './services/InterceptorsService';
import './index.css';
import './styles/global.css';
import './styles/dashboardView.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
interceptorsService.createInterceptors();

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
