import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";
if (sessionStorage.getItem("token") !== null) {
  axios.defaults.headers.common['Authorization'] = "Bearer " + sessionStorage.getItem("token");
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);