import React, { Component } from 'react';
import ReactDOM from 'react-dom';

let sanitizeHtml = require('sanitize-html');

class Message extends Component {
    constructor(props){
        super(props);
        this.btnList =[];
        this.getbtnList = this.getbtnList.bind(this)
    }
    componentDidMount() {
        if(this.props.chat.content && this.props.chat.content.length && !this.props.chat.content.includes('blob:http')) {
            ReactDOM.findDOMNode(this.refs.sanitizedContent).innerHTML = sanitizeHtml(this.props.chat.content);
        }
    }
    getbtnList(){
        let i=1;
        return this.props.chat.buttons.map((button) => {
            return <div key={i++} className="buttons-wrapper-div"><button className="response-button" onClick={this.props.onClick.bind(this, button)}>{button.title}</button></div>
       });
       
    }
    render() {
        return(
        <div className="message-main-div col-xs-12">
        {
            !this.props.chat.loaderImg && 
                <li className={`chat ${this.props.user === this.props.chat.username ? "right" : "left"}`}>
                    <div className="chat-timestamp">{this.props.chat.timestamp}</div>
                    {this.props.user !== this.props.chat.username && this.props.index === this.props.length && this.props.chat.img &&
                    <img className="avatar-img" src={this.props.chat.img} alt={`${this.props.chat.username}'s profile pic`} />}
                    {this.props.chat.content && !this.props.chat.content.includes('blob:http') && this.props.chat.content.length && <div className="chat-text" ref="sanitizedContent"></div>}
                    {this.props.chat.content && this.props.chat.content.includes('blob:http') && <audio className="audiocontrols" ref="audioSource" controls="controls" src={this.props.chat.content}></audio>}
                </li>
        } 
        { 
            this.props.chat.loaderImg && 
                <li className="chat">
                    <div className="loader-image">
                        <img src={this.props.chat.loaderImg} alt="loading"/>
                    </div> 
                </li>
        }
        { this.props.user !== this.props.chat.username && this.props.chat.buttons &&
        <div className={this.props.index === this.props.length ? "buttonwrapper" : ""}>
            {this.getbtnList()}
        </div>
        }
        </div>
        
        )
    }
}
 
export default Message;