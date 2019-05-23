import { shallow, mount } from "enzyme";
import React from "react";
import Chatroom from "../components/Chatroom";
import sinon from 'sinon';


describe("The ChatRoom component", () => {

it('pass message according to counter 1 on if condition',()=> {
  const wrapper = mount(
    <Chatroom />
  );
  let counter = 1;
  wrapper.instance().counter = 1;
  let timeMsg = wrapper.instance().startTimerAndPassIntent();
  expect(timeMsg).toEqual('timer1');
});
it('pass message according to counter 2 on else if condition',()=> {
  const wrapper = mount(
    <Chatroom />
  );
  let counter = 2;
  wrapper.instance().counter = 2;
  let timeMsg = wrapper.instance().startTimerAndPassIntent();
  expect(timeMsg).toEqual('timer2');
});
it('pass message according to counter 0 on else condition',()=> {
  const wrapper = mount(
    <Chatroom />
  );
  let counter = 0;
  wrapper.instance().counter = 0;
  let timeMsg = wrapper.instance().startTimerAndPassIntent();
  expect(timeMsg.length).toEqual(0);
});


it('startTimerAndPassIntent is called', (done) => {
  const wrapper = mount(
    <Chatroom />
  );
  // spy on the function we need to check if called
  const spy = sinon.spy(wrapper.instance(), 'postMessageData');

 wrapper.instance().requestmsgPush('change service level');

  setTimeout(() => {
      // check if spy was called
      sinon.assert.called(spy);
      done();
  }, 3000);
});

it('Should call error function if validation failes on chat initiation', (done) => {
  const wrapper = mount(
    <Chatroom />
  );
  // spy on the function we need to check if called
  const spy = sinon.spy(wrapper.instance(), 'showErrorMessage');

 wrapper.instance().validateAndSetParamValues({});

  setTimeout(() => {
      // check if spy was called
      sinon.assert.called(spy);
      done();
  }, 3000);
});

it('Error function should call response show function', (done) => {
  const wrapper = mount(
    <Chatroom />
  );
  // spy on the function we need to check if called
  const spy = sinon.spy(wrapper.instance(), 'getResponseShow');

 wrapper.instance().showErrorMessage();

  setTimeout(() => {
      // check if spy was called
      sinon.assert.called(spy);
      done();
  }, 3000);
});

it('Should call post message data if validation passes on chat initiation', (done) => {
  var paramData = {
    userId: '1234',
    userFirstName: 'Rob'
}
  const wrapper = mount(
    <Chatroom />
  );
  // spy on the function we need to check if called
  const spy = sinon.spy(wrapper.instance(), 'postMessageData');

 wrapper.instance().validateAndSetParamValues(paramData);

  setTimeout(() => {
      // check if spy was called
      sinon.assert.called(spy);
      done();
  }, 3000);
});

it('requestmsgPush is called', (done) => {
  const wrapper = mount(
    <Chatroom />
  );
  // spy on the function we need to check if called
  const spy = sinon.spy(wrapper.instance(), 'requestmsgPush');

  // call the function being tested
  const mockedEvent = {
    preventDefault: () => {
    }
   }
  wrapper.instance().submitMessage(mockedEvent, 'hi');


  setTimeout(() => {
      // check if spy was called
      sinon.assert.called(spy);
      done();
  }, 10);

});


  it("should render chats ul", () => {
    const wrapper = mount(
      <Chatroom user="foo" chat={{ username: "bar", buttons: [] }} />
    );
    expect(wrapper.find(".chats").length).toEqual(1);
  });
  //testing form
  it("should render the input with text string", () => {
    const wrapper = mount(<Chatroom />);
    wrapper
      .find(".textBox")
      .simulate("change", { target: { value: "My new value" } });
  });
  //render submit button wrapper
  it("should render the form with submit button", () => {
    const wrapper = mount(<Chatroom chat={{ msg: "bar" }} />);
    expect(wrapper.find(".submit-span").length).toEqual(1);
  });

  //expect change state on message array
  it("should change state of chats array with response messages", () => {
    const wrapper = mount(<Chatroom />);
    const chats = [];
    const newchatsArrayAfterResponse = [{
      timestamp: "1530103502304",
      username: "Alice Chen", //bot usernmae
      content: "Hi",
      buttons: ['hi'],
      img: "Dummy Image"
    }];
    expect(wrapper.find(".chats div li").length).toEqual(0);
    wrapper.setState({ chats: newchatsArrayAfterResponse });
    expect(wrapper.find(".chats div li").length).toEqual(1);
  });
  //simulates button click
  it('simulates click events', () => {
    const wrapper = mount(<Chatroom user='foo'/>);
    const instance = wrapper.instance();

    spyOn(instance, 'handleClick').and.callThrough();

    const chat = [];
    const items = [
      {
        timestamp :( new Date()).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
        username: "Alice Chen",//bot usernmae
        content: 'foo',
        buttons: ['Hi']
      }
    ]
    wrapper.setState({chats:items});
    wrapper.find('button').simulate('click');
    expect(instance.handleClick).toHaveBeenCalled();
  });
  //expect change state of loader after response has come
  it("expect change state of loader after response has come", () => {
    const wrapper = mount(<Chatroom />);
    wrapper.instance().requestmsgPush('foo');
    expect(wrapper.find(".loader-image").length).toEqual(0);
  });

  it('should have a `<form>` element', () => {
    const wrapper = mount(<Chatroom user='foo' chat={{username: 'bar', buttons: []}} />)
    expect(wrapper.find('form').length).toBe(1);
  });


  it('form element should have text', () => {
    const wrapper = mount(<Chatroom user='foo' chat={{username: 'bar', content:'Hi'}} />)
    expect(wrapper.find('input').length).toBe(2);
  });
  
  it('Form should be submitted',() => {
    const wrapper = mount(<Chatroom user='foo' />)
    expect(wrapper.find('.submit-span').length).toBe(1);
  });
//setting buttons in message
it('It should add button content to message', () => {
  const wrapper = mount(<Chatroom user='foo' />);
  var responseData = {
      channelname: "web",
      templatename: "Prompt",
      sessionId: "0a10582b-c153-47d7-86b0-e7fce5fca69e",
      tenantid: "d563cc487b",
      botid: "74a5182dcb",
      input_msg: "hi",
      response_template:
      {
        "attachment":
        {
          "type":"template",
          "payload":
          {
            "template_type":"button",
            "text":"Ok, which SLA would you like to select?",
            "buttons":[
              {
                "type":"postback",
                "title":"NBD",
                "payload":"NBD"
              },
              {
                "type":"postback",
                "title":"24x7",
                "payload":"24x7"
              },
              {
                "type":"postback",
                "title":"6 hour CTR",
                "payload":"6 hour CTR"
              }
            ]
          }
        }
      },
      timestamp: 1530097728586
  };
  let poploader = wrapper.instance().getResponseShow(responseData);
  expect(poploader).toBe(true);
});

});

describe("Testing a form", () => {

  it("can fill out the form", () => {
      
      const wrapper = mount(<Chatroom chat={{content:'Hi'}} />);
      //const onSubmit=sinon.spy();
      const instance = wrapper.instance();
      spyOn(instance, 'submitMessage').and.callThrough();
      wrapper.find('form').simulate('submit');
      expect(instance.submitMessage).toHaveBeenCalled();
  });
  //state should retain length after popping loader and pushing response
  it('It should retain length of chat array', () => {
    const wrapper = mount(<Chatroom user='foo' />);
    const arr = [{
      content: "change service level",
      timestamp: "6:38 PM", //bot usernmae
      username: "Kevin Hsu"
    }];
    wrapper.setState({chats: arr});
    expect(wrapper.instance().state.chats.length).toEqual(1);
    let length = wrapper.instance().popLoaderAndPushReponse('1:23PM', 'Hi', ['Hi'], 'xyz');
    expect(length).toEqual(2);
  });
  //setting content as message
  it('It should add content to message', () => {
    const wrapper = mount(<Chatroom user='foo' />);
    var responseData = {
        channelname: "web",
        templatename: "Prompt",
        sessionId: "0a10582b-c153-47d7-86b0-e7fce5fca69e",
        tenantid: "d563cc487b",
        botid: "74a5182dcb",
        input_msg: "hi",
        response_template: {
          text: "Hi"
        },
        timestamp: 1530097728586
    };
    let poploader = wrapper.instance().getResponseShow(responseData);
    expect(poploader).toBe(true);
  });
  //setting normal text as message
  it('It should add text only content to message', () => {
    const wrapper = mount(<Chatroom user='foo' />);
    var responseData = 'Hello';
    let poploader = wrapper.instance().getResponseShow(responseData);
    expect(poploader).toBe(false);
  });
});
