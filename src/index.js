import React from 'react';
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

//window.storedObjectsUpload = [];
createRoot(document.getElementById('root')).render(<App />)


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

