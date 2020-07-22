import React from 'react';
import ReactDOM from 'react-dom';
import Chart from "chart.js";
import LineChart from "./myChartsThis.js";
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Grid } from "@material-ui/core";
import Header from "./header.js";


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();