'use strict';

const config = require('config');
const apiai = require('apiai');
const uuid = require('uuid');
const request = require('request');

// Generate a page access token for your page from the App Dashboard
const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
  (process.env.MESSENGER_PAGE_ACCESS_TOKEN) :
  config.get('pageAccessToken');

// APIAI access token
const APIAI_ACCESS_TOKEN = (process.env.APIAI_ACCESS_TOKEN) ?
  (process.env.APIAI_ACCESS_TOKEN) :
  config.get('apiAiAccessToken');

if (!(APIAI_ACCESS_TOKEN && PAGE_ACCESS_TOKEN)) {
  console.error("Missing config values: FacebookBot.js");
  process.exit(1);
}

/**
 * FacebookBot class
 * https://github.com/api-ai/apiai-nodejs-client/blob/master/samples/facebook/src/app.js
 *
 */
class FacebookBot {
  constructor() {
    this.apiAiService = apiai(APIAI_ACCESS_TOKEN, {language: 'en', requestSource: "fb"});
    this.sessionIds = new Map();
  }

  processText(sender, text) {
    // Handle a text message from this sender
    if (!this.sessionIds.has(sender)) {
      this.sessionIds.set(sender, uuid.v4());
    }

    // Send user's text to api.ai service
    let apiaiRequest = this.apiAiService.textRequest(text, {
      sessionId: this.sessionIds.get(sender)
    });

    // Get response from api.ai
    apiaiRequest.on('response', (response) => {
      if (this.isDefined(response.result) && this.isDefined(response.result.fulfillment)) {
        let responseText = response.result.fulfillment.speech;
        let responseData = response.result.fulfillment.data;
        let responseMessages = response.result.fulfillment.messages;

        let action = response.result.action;

        console.log("APIAI Response: " + JSON.stringify(response.result));

        if(this.isDefined(responseText)) {
          this.sendTextMessage(sender, responseText);
        }
        else {
          this.sendTextMessage(sender, "Sorry couldn't understand that.");
        }

      }
    });

    apiaiRequest.on('error', (error) => console.error(error));
    apiaiRequest.end();
  }

  isDefined(obj) {
    if (typeof obj == 'undefined') return false;
    if (!obj) return false;
    return obj != null;
  }

  /*
	 * Send a text message using the Send API.
	 *
	 */
	sendTextMessage(recipientId, messageText) {
	  var messageData = {
	    recipient: {
	      id: recipientId
	    },
	    message: {
	      text: messageText,
	      metadata: "DEVELOPER_DEFINED_METADATA"
	    }
	  };

	  this.callSendAPI(messageData);
	}

	/*
	 * Call the Send API. The message data goes in the body. If successful, we'll 
	 * get the message id in a response 
	 *
	 */
	callSendAPI(messageData) {
	  request({
	    uri: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: { access_token: PAGE_ACCESS_TOKEN },
	    method: 'POST',
	    json: messageData

	  }, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	      var recipientId = body.recipient_id;
	      var messageId = body.message_id;

	      if (messageId) {
	        console.log("Successfully sent message with id %s to recipient %s", 
	          messageId, recipientId);
	      } else {
	      console.log("Successfully called Send API for recipient %s", 
	        recipientId);
	      }
	    } else {
	      console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
	    }
	  });  
	}
}

exports = module.exports = new FacebookBot();