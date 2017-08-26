'use strict';

import 'babel-polyfill';
import React                from 'react';
import ReactDOM             from 'react-dom';
import Invoice  from '../pages/invoice/index.jsx';

// import 'animate.css';
import 'jquery';
// import 'font-awesome/css/font-awesome.min.css';
// import 'bootstrap/dist/js/bootstrap.min.js';
// import './style/customBootstrap/style.css';

const ELEMENT_TO_BOOTSTRAP  = 'root';
const BootstrapedElement    = document.getElementById(ELEMENT_TO_BOOTSTRAP);

ReactDOM.render(<Invoice/>, BootstrapedElement);