'use strict';

const config = require('config');
const apiai = require('apiai');
const uuid = require('uuid');
const request = require('request');

const noteTaker = require('./NoteTaker');
const quill = require('./Quill');

// Generate a page access token for your page from the App Dashboard
const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
  (process.env.MESSENGER_PAGE_ACCESS_TOKEN) :
  config.get('pageAccessToken');

// APIAI access token
const APIAI_ACCESS_TOKEN = (process.env.APIAI_ACCESS_TOKEN) ?
  (process.env.APIAI_ACCESS_TOKEN) :
  config.get('apiAiAccessToken');

// URL where the app is running (include protocol). Used to point to scripts and 
// assets located at this address. 
const SERVER_URL = (process.env.SERVER_URL) ?
  (process.env.SERVER_URL) :
  config.get('serverURL');

if (!(APIAI_ACCESS_TOKEN && PAGE_ACCESS_TOKEN && SERVER_URL)) {
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

    // This will store important state information about user
    this.users = new Map();
  }

  /*
   * Function to do some preProcessing on the sender before we process the text
   * messages.
   */
  preProcess(sender) {
    // check if the sender exists in users Map
    if (!this.users.has(sender)) {
      var user = {
        sessionId: uuid.v4(),     // sessionId for apiAi service
        // currentState: 'default'   // ['default', 'create-note', 'show-notes']
      }

      this.users.set(sender, user);
    }
  }

  processText(sender, text) {
    // Send the text to apiai servers to process
    // In the future, we will want to maintain user's status and act accordingly.
    // For example, if the user is in 'create-note' mode, we will want to save the message to the database instead

    this.preProcess(sender);

    if (text == 'list') {
      var that = this;

      noteTaker.getNotes(sender, 5, 'DATE_GOES_HERE', 
        function(response) {
          that.sendListMessage(sender, response.data);
        },
        function (error) {
          console.log(error);
        });

      return;
    } else if (text == 'quickreply') {

      var sampleMessage = {
        type: 'quick_reply',
        text: 'Hello, I am a notes bot. I can help you take rich notes.',
        quick_replies: [
          {
            content_type: 'text',
            title: "Show me how!",
            payload: "GET_STARTED_SHOW_ME_HOW"
          }
        ]
      };

      this.sendQuickReplies(sender, sampleMessage);

      return;
    } else if (text.trim().toUpperCase() === 'DONE') {

      // User finished creating note

      // Check if the user has a note field or not
      if (this.users.get(sender).hasOwnProperty('note')) {

        var that = this;

        // stringify note.body
        var data = {
          title: this.users.get(sender).note.title,
          body: JSON.stringify(this.users.get(sender).note.body),
          text: this.users.get(sender).note.text,
          author: sender.toString()
        };

        noteTaker.postNote(data, 
          function (res){
            if (res.data.success === true) {
              that.sendTextMessage(sender, "You have successfully created a note.");
            } else {
              that.sendTextMessage(sender, "Something went wrong. Your note couldn't be saved successfully.");
            }
          },
          function (err){
            console.log(err);
            that.sendTextMessage(sender, "Something went wrong. I will get back to you later about this.");
          });

        delete this.users.get(sender).currentState;
        delete this.users.get(sender).note;

      }

      return;

    } else if (text === 'button') {

      // Send a button message
      var messageData = {
        text: 'Your new note has been created successfully.',
        buttons: [
          {
            "type":"web_url",
            "url":"https://4662608c.ngrok.io/ ",
            "title":"Show note"
          },
          {
            "type":"postback",
            "title":"Edit",
            "payload":"USER_DEFINED_EDIT"
          },
          {
            "type":"postback",
            "title":"Delete",
            "payload":"USER_DEFINED_DELETE"
          }
        ]
      };

      this.sendButtonMessage(sender, messageData);
      return;
    }


    // When the user state is 'default', we want to send the requests to apiai servers
    // to make sense of the data
    switch (this.users.get(sender).currentState) {

      case 'create-note':
        quill.addText(this.users.get(sender).note, text);
        break;

      default:
        this.sendApiAiRequest(sender, text);
        break;
    }
    
  }


  /*
   * Method to send request to apiai service for natural language understanding
   * Actions are taken based on what apiai service returns
   *
   */
  sendApiAiRequest(sender, text) {

    // Send user's text to api.ai service
    let apiaiRequest = this.apiAiService.textRequest(text, {
      sessionId: this.users.get(sender).sessionId
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

  /* 
   * Method to process the attachments
   * @params: attachments => [attachment]
   * https://developers.facebook.com/docs/messenger-platform/webhook-reference/message
   */ 
  processAttachments(sender, attachments) {
    this.preProcess(sender);
    this.sendTextMessage(senderID, "Message with attachment received");
  }

  /* 
   * Method to process the postbacks
   * @params: postback
   * https://developers.facebook.com/docs/messenger-platform/webhook-reference/message
   */ 
  processPostback(sender, payload) {
    this.preProcess(sender);

    switch (payload) {
      case 'MENU_CREATE_A_NOTE':
        console.log(this.users.get(sender));
        this.users.get(sender).currentState = 'create-note';
        this.users.get(sender).note = {
          title: null,
          body: { ops: [] },
          text: ''
        };
        this.sendTextMessage(sender, "Start typing your notes. Type \'DONE\' when you are finished.");
        break;

      default:
        this.sendTextMessage(sender, "Postback called with payload: " + payload);
    }
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
   * Send a button message using the Send API.
   *
   */
  sendButtonMessage(recipientId, message) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: message.text,
            buttons: message.buttons
          }
        }
      }
    };
    
    this.callSendAPI(messageData);
  }

  /*
   * Send a quick reply using the Send API.
   *
   */
  sendQuickReplies(recipientId, message) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: message.text,
        quick_replies: message.quick_replies
      }
    };

    this.callSendAPI(messageData);
  }

  /*
   * Send a list message using the Send API.
   *
   */
  sendListMessage(recipientId, notes) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "list",
            top_element_style: "compact",
            elements: [],
            buttons: [
                {
                    "title": "View More",
                    "type": "postback",
                    "payload": "VIEW_MORE"                        
                }
            ]
          }
        }
      }
    };

    notes.forEach(function(note) {
      var elem = {
        title: note.title,
        subtitle: note.body,
        default_action: {
          type: 'web_url',
          url: 'https://4662608c.ngrok.io/note/' + note._id,
          messenger_extensions: true,
          webview_height_ratio: 'tall',
          fallback_url: 'https://4662608c.ngrok.io'
        }
      };

      messageData.message.attachment.payload.elements.push(elem);
    });

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