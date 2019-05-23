import { mount } from "enzyme";
import React from "react";
import Chatroom from "../components/Chatroom";
import { axiosPostCall } from '../services/postmessage';
import sinon from 'sinon';


describe("The Message component", () => {
    //axio call
    it("posts data when postMessageData is called", async done => {
      var responseData = {
        channelname: "web",
        templatename: "Prompt",
        sessionId: "0a10582b-c153-47d7-86b0-e7fce5fca69e",
        tenantid: "d563cc487b",
        botid: "74a5182dcb",
        input_msg: "hi",
        response_template: {
          text: "Your input is invalid.Please type the valid option number."
        },
        timestamp: 1530097728586
      };

      let params = {
        'parentParams' : {
          "userId": "12345678",
          "userFirstName": "Rob",
          "recordName": "Final Opportunity",
          "recordId": "001G000000mkI4y",
          "orginatingPage": "account",
          "createdDateTime": "12344",
          "targetIds": ["abcd"],
          "targetType": "change service level",
          "recommendationType": "service",
          "recommendationId": "",
          "recommendationValue": "Foundation Care",
          "recomendedenddate":"24/07/2018" 
      }
    }
        axiosPostCall("hi",params)
        .then(response => {
          // console.log(response.data);
          expect(response.data.channelname).toEqual("web");
          done();
        },10000).catch((error) => {
          console.log(error);
        });
    });
});