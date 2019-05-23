import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import Chatroom from './components/Chatroom';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Chatroom />, document.getElementById('root'));
registerServiceWorker();
