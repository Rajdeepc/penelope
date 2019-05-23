import React from 'react';
import ReactDOM from 'react-dom';
import Chatroom from '../components/Chatroom';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Chatroom />, div);
});
