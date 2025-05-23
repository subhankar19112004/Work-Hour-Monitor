// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Redux imports
import { Provider } from 'react-redux';
import { store } from './app/store'; // Path to your Redux store

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>  {/* Wrap App with Redux Provider */}
      <App />
    </Provider>
  </React.StrictMode>
);
