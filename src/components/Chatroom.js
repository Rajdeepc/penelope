import React, { Component } from "react";
import ReactDOM from "react-dom";
import Message from "../components/Message";
// import axios from "axios";
import botavatar from "../assets/img/robot.png";
import loader from "../assets/img/loader.gif";
import { assignContent } from "../services/fetch_old_conv";
import * as myConstClass from "../utils/constants";
// import "../dist/aws-lex-audio.js";
// import '../dist/renderer.js';
import { ReactMic } from "react-mic";


const AWS = require("aws-sdk");
AWS.config.region = "eu-west-1";
AWS.config.credentials = new AWS.Credentials(
  process.env.REACT_APP_USERKEY,
  process.env.REACT_APP_USERSECRET,
  null
);

class Chatroom extends Component {
  constructor(props) {
    super(props);
    /** passing tile id as empty initially */
    this.tileId = "";
    /** timer values */
    this.timer1 = myConstClass.TIMER1_CLOCK;
    this.timer2 = myConstClass.TIMER2_CLOCK;
    /** initial state */
    this.state = {
      chats: [],
      showFeedback: false,
      showFeedbackBtn: false,
      blobObject: null,
      isRecording: false,
      isPaused: false
    };
    /** passing session id as empty initially */
    this.sessionid = "";
    /** passing newSLA as empty initially */
    this.newSLA = "";
    /** passing newServiceLevel as empty initially */
    this.newServiceLevel = "";

    /** setting countcheck as 0 initially */
    this.countcheck = 0;
    /** setting parentParams as an empty object initially */
    this.parentParams = {};
    /** setting counter as 1 initially */
    this.counter = 1;
    /** setting clearTimeOutObj as empty object */
    this.clearTimeOutObj = {};
    /** setting greeting message flag as true on first response*/
    this.responsetobeattached = true;
    /** to check valid serial number is coming or not. */
    this.pageNumber = 0;
    /**record per page to show in fetch */
    this.recordPerPage = 5;
    /** total records to show in fetch */
    this.totalRecords = 0;
    /** flag to check fetch button is clicked. */
    this.loadMoreClick = false;
    /** initialize chat array */
    this.chatArr = [];
    this.validSerial = "";
    /** to check valid serial number is coming or not. */
    this.validCovered = "";
    /** to set the serial number text  */
    this.validText = "";
    /** to check if valid serial numbered products are covered */
    this.validCoveredCheck = "";
    /** to check if end date is valid */
    this.validEndDate = "";
    /** to set the parent intent and if intent hop then change and send */
    this.recommendationType = "";
    /** to set the recommendation value and if intent hop then change and send */
    this.recommendation = "";
    /**to send whenever serial number comes */
    this.serialNo = "";
    /** whether data is fetched on scroll or not. */
    this.scrollFlag = false;
    /** flag to save to db */
    this.saveToDB = false;
    /** flag to check quoteID and set */
    this.validQuote = "";
    /** referencing the submitMessage function call */
    this.submitMessage = this.submitMessage.bind(this);
  }

  /** lifescycle method after component has mounted. */
  componentDidMount() {
    // this.getUniqueId();
    // this.getParentParams(this.tileId);
    this.postMessageData('hi');
    console.log(window.location.href);
    this.scrollToBot();
  }
  /** lifescycle method after component has updated after changes. */
  componentDidUpdate() {
    this.scrollToBot();
  }

  /**
   * timer functionality and send intent as request
   */
  startTimerAndPassIntent() {
    let time;
    let timeMsg = "";
    if (this.counter < 3) {
      if (this.counter === 1) {
        time = this.timer1;
        timeMsg = myConstClass.TIMER1_INTENT;
      } else if (this.counter === 2) {
        time = this.timer2;
        timeMsg = myConstClass.TIMER2_INTENT;
      } else {
      }
      this.clearTimeOutObj = setTimeout(() => {
        this.saveToDB = false;
        this.postMessageData(timeMsg);
        this.saveToDB = true;
        this.counter++;
      }, time);
    }
    return timeMsg;
  }

  

  /** Show error messages when there is a null key */
  showErrorMessage(response) {
    this.getResponseShow(response, false);
  }

  /** scroll to top after each message is displaed in chatroom */
  scrollToBot() {
    if (this.scrollFlag && this.loadMoreClick) {
      ReactDOM.findDOMNode(this.refs.chats).scrollTop =
        ReactDOM.findDOMNode(this.refs.chats).scrollHeight / 10;
    } else {
      ReactDOM.findDOMNode(this.refs.chats).scrollTop = ReactDOM.findDOMNode(
        this.refs.chats
      ).scrollHeight;
    }
  }

  /** event click on submit to push message in chatroom or open link in new tab */
  handleClick(button) {
    if (button.type === "postback") {
      this.requestmsgPush(button.payload);
    } else if (button.type === "linkbutton") {
      window.open(button.payload, "_blank");
    } else {
    }
    this.refs.msg.focus();
  }

  /** post call to AWS with required input parameters. */

  postMessageData(value) {
    this.lexruntime = new AWS.LexRuntime();
    const params = {
      botAlias: "JobFinder",
      botName: "JobFinder",
      userId: "User123",
      inputText: value, //change the text to user enters
      sessionAttributes: {} //To maintain session
    };
    this.lexruntime.postText(params, (err, data) => {
      if (err) {
        console.log(err);
      }
      if (data) {
        this.getResponseShow(data.message, true);
      }
    });
  }

  /** push user messages to chats array and show in chatroom and update state of chats. */
  requestmsgPush(reqMessage) {
    clearTimeout(this.clearTimeOutObj);
    this.scrollFlag = false;
    this.counter = 1;
    let time = new Date();
    let me = this;
    this.setState(
      {
        chats: this.state.chats.concat([
          {
            timestamp: time.toLocaleString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true
            }),
            username: me.parentParams.userFirstName,
            content: reqMessage
          }
        ])
      },
      () => {
        ReactDOM.findDOMNode(this.refs.msg).value = "";
        this.setState({
          chats: this.state.chats.concat([
            {
              username: "bot", // bot username
              loaderImg: loader,
              buttons: []
            }
          ])
        });
        this.postMessageData(reqMessage);
      }
    );
  }
  /** function to add message to chats array and call the aws api */
  submitMessage(e, val) {
    e.preventDefault();
    let reqMessage = val;
    if (!reqMessage.length) {
      return;
    }
    this.requestmsgPush(reqMessage);
  }

  /**
   * popping off loader once response pushed into array
   */
  popLoaderAndPushReponse(time, content, btncontent, botavatar, poploader) {
    let arr = this.state.chats;
    if (poploader) {
      arr.splice(-1, 1);
    }
    this.setState(
      {
        chats: arr
      },
      () => {
        this.setState({
          chats: this.state.chats.concat([
            {
              timestamp: time.toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true
              }),
              username: "bot", //bot usernmae
              content: content,
              buttons: btncontent || [],
              img: botavatar
            }
          ])
        });
      }
    );
    return this.state.chats.length;
  }

  /**
   *
   * get function to get data after bot responds.
   */

  assignContent(text) {
    let splitchar = myConstClass.SPLITCHAR;
    if(text && text.indexOf(splitchar) > 0) {
      let msgArr = text.split(splitchar);
      return msgArr;
    } else {
      return [text];
    }
  }

  
  getResponseShow(response, isPoploder) {
    let btncontent = [];
    let buttons = [];
    let time = new Date();
    let contentArr;
    let poploader = isPoploder !== undefined ? isPoploder : true;
    let timerIntentArr = [
      myConstClass.TIMER1_INTENT,
      myConstClass.TIMER2_INTENT
    ];
    if (response && response.response_template) {
      let responsetemplate = response.response_template;
      if (timerIntentArr.indexOf(response.input_msg) >= 0) {
        poploader = false;
      }
      if (!responsetemplate.attachment) {
        let text = responsetemplate.text;
        contentArr = assignContent(text);
      } else {
        let text = responsetemplate.attachment.payload.text;
        contentArr = assignContent(text);
        buttons = responsetemplate.attachment.payload.buttons;
        btncontent = buttons;
      }
    } else {
      contentArr = [response];
    }
    /** iterating over message arrays and show single/multiple bubbles */
    let buttonArr = btncontent;
    contentArr.map((content, index) => {
      poploader = index > 0 ? false : poploader;
      let totalBubbles = contentArr.length;
      if (totalBubbles > 1 && index !== totalBubbles - 1) {
        btncontent = [];
      } else {
        btncontent = buttonArr;
      }
      this.popLoaderAndPushReponse(
        time,
        content,
        btncontent,
        botavatar,
        poploader
      );
      return content;
    });

    return poploader;
  }
  startRecording = () => {
    this.setState({
      record: true
    });
  };

  stopRecording = () => {
    this.setState({
      record: false
    });
  };

  onData(recordedBlob){
    console.log('ONDATA CALL IS BEING CALLED! ', recordedBlob);
  }

  onSave(blobObject) {
    console.log("blobObject" + blobObject);
  }

  onStop= (blobObject) => {
    this.setState({ blobURL : blobObject.blobURL });
    this.requestmsgPush(this.state.blobURL);
  }
  
  render() {
    const username = this.parentParams.userFirstName; // change once it comes from parent app
    const { chats } = this.state;
    let i = 1;
    return (
      <div className="chatroom">
        <div className="clearfix">
          <ul
            className="chats col-xs-12"
            ref="chats"
            onScroll={this.scrollEvent}
          >
            {chats.map((chat, index) => (
              <Message
                key={i++}
                index={index + 1}
                length={chats.length}
                chat={chat}
                user={username}
                onClick={this.handleClick.bind(this)}
              />
            ))}
          </ul>
        </div>

        <div className="formInput">
          <form
            className="input"
            onSubmit={e => this.submitMessage(e, this.refs.msg.value)}
          >
            <div className="col-xs-10">
              <input type="text" ref="msg" className="textBox" placeholder="Type your message here.."/>
              <span className="submit-span submitBtn">
                {/* <img
                  src={send}
                  className="send-img img-responsive"
                  alt="submit"
                /> */}
                <input type="submit" value="" />
              </span>
            </div>
            <div className="col-xs-2 text-center no-padding">
              {/* <i
                className="fa fa-microphone fa-2x"
                // onClick={this.record.bind(this)}
                aria-hidden="true"
              /> */}
              <ReactMic
                record={this.state.record}
                className="sound-wave"
                onStop={this.onStop.bind(this)}
                onData={this.onData.bind(this)}
                onSave={this.onSave.bind(this)}
                strokeColor="#000000"
                backgroundColor="#FF4081"
              />
              {
                !this.state.record && <i
                className="iconWhite fa fa-microphone fa-2x"
                aria-hidden="true"
                onClick={this.startRecording}
              />
              }
              { this.state.record && <i onClick={this.stopRecording} className="iconWhite fa fa-stop-circle fa-2x"  aria-hidden="true"></i>}
              
            </div>
            <div />
          </form>
        </div>
      </div>
    );
  }
}

export default Chatroom;
