import {shallow,mount} from 'enzyme'
import React from 'react';
import Message from '../components/Message'
import sinon from 'sinon';

//render chat div with appropriate props
describe('The Message component', () => {
  it('should render li.chat.left when props.user !== props.chat.username', () => {
    const wrapper = shallow(<Message user='foo' chat={{username: 'bar', buttons: []}} />)
    expect(wrapper.find('li.chat.left').length).toEqual(1)
    expect(wrapper.find('li.chat.right').length).toEqual(0)
  });

  //render chat div with appropriate props
  it('should render li.chat.right when props.user === props.chat.username', () => {
    const wrapper = shallow(<Message user='foo' chat={{username: 'foo', buttons: []}} />)
    expect(wrapper.find('li.chat.left').length).toEqual(0)
    expect(wrapper.find('li.chat.right').length).toEqual(1)
  });

  //render timestamp with appropriate props
  it('should render the chat.timestamp prop as .chat-timestamp', () => {
     const wrapper = shallow(<Message user='foo' chat={{timestamp: '1234', buttons: []}} />)
     expect(wrapper.find('.chat-timestamp').text()).toEqual('1234')
  });

  //render content with appropriate props
  it('should render the chat.text prop as .chat-text', () => {
    const wrapper = mount(<Message user='foo' chat={{content: 'Hi', buttons: []}} />)
    expect(wrapper.find('.chat-text').text()).toEqual('Hi');
 });

   //render loader with appropriate props
   it('should render the loader', () => {
    const wrapper = shallow(<Message user='foo' chat={{loaderImg: 'loader.gif', buttons: []}}/>)
    expect(wrapper.find('.loader-image').length).toEqual(1)
 });

  //render content with appropriate props
  it('should render the button with button text', () => {
    const buttons = ['Proactive Care'];
    const wrapper = shallow(<Message user='foo' chat={{buttons: []}} />);
    expect(['Proactive Care', 'Bob', 'Eve']).toEqual(
        expect.arrayContaining(buttons)
      );
 });
 //simulates button click
 it('simulates click events', () => {
  const onButtonClick = sinon.spy();
  const wrapper = shallow(<Message user='foo' chat={{buttons: ['Hi']}} onClick={onButtonClick} />);
  wrapper.find('.response-button').simulate('click');
  expect(onButtonClick.calledOnce).toEqual(true);
});
})