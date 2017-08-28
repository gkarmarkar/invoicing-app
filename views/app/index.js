'use strict';

import 'babel-polyfill';
import React                from 'react';
import ReactDOM             from 'react-dom';
import Invoice  from '../pages/invoice/index.jsx';

import 'jquery';

const ELEMENT_TO_BOOTSTRAP  = 'root';
const BootstrapedElement    = document.getElementById(ELEMENT_TO_BOOTSTRAP);

ReactDOM.render(<Invoice/>, BootstrapedElement);