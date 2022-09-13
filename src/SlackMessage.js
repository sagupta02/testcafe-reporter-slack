// import config from './config';
import loggingLevels from "./const/LoggingLevels";
import WebClient from "@slack/web-api";
import * as dotenv from 'dotenv';
dotenv.config()

const token = process.env.SLACK_TOKEN;
const testTagArray = [];

const conversationId = process.env.TESTCAFE_SLACK_CHANNEL;

export default class SlackMessage {
  constructor() {
    
    this.slack = new WebClient(token);
    
    this.loggingLevel = 'TEST';
    this.messages = [];
    this.errorMessages = [];
  }

  addMessage(message) {
    this.messages.push(message)
  }

  addErrorMessage(message) {
    this.errorMessages.push(message)
  }

  sendMessage(message, slackProperties = null) {
    this.slack.chat.postMessage({
      channel: config.channel,
      text: '',
      blocks: [{
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": ":warning: Test cafe Report Staging",
          "emoji": true
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": ">>>Test Tags: @smoke\n:no_entry: *1/10 failed*"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": ">>>*Failed tests:*\n:no_entry: One dashboard, view all link leads to dashboards page - failed\n:no_entry: One dashboard, view all link leads to salesforce page - failed"
          }
        ]
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "emoji": true,
              "text": "Gitlab Pipeline"
            },
            "url": "https://gitlab.usabilla.net/usabilla/dev/direct/test-cafe-shaker/-/jobs/2133149",
            "value": "click_me_123"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "emoji": true,
              "text": "Test Report"
            },
            "url": "https://www.intranet.usabilla.nl/qa/testcafe/325287/2133149/",
            "value": "click_me_123"
          }
        ]
      }
      ]
    }, function (err, response) {
      if (!config.quietMode) {
        if (err) {
          console.log('Unable to send a message to slack');
          console.log(response);
        } else {
          console.log(`The following message is send to slack: \n ${message}`);
        }
      }
    })
/*     this.slack.webhook(Object.assign({
      channel: config.channel,
      username: config.username,
      text: message
    }, slackProperties), function (err, response) {
      if (!config.quietMode) {
        if (err) {
          console.log('Unable to send a message to slack');
          console.log(response);
        } else {
          console.log(`The following message is send to slack: \n ${message}`);
        }
      }
    }) */
  }

  sendTestReport(nrFailedTests) {
    this.sendMessage(this.getTestReportMessage(), nrFailedTests > 0 && this.loggingLevel === loggingLevels.TEST
      ? {
        "attachments": [{
          color: 'danger',
          text: `${nrFailedTests} test failed`
        }]
      }
      : null
    )
  }

  getTestReportMessage() {
    let message = this.getSlackMessage();
    let errorMessage = this.getErrorMessage();

    if (errorMessage.length > 0 && this.loggingLevel === loggingLevels.TEST) {
      message = message + "\n\n\n```" + this.getErrorMessage() + '```';
    }
    return message;
  }

  getErrorMessage() {
    return this.errorMessages.join("\n\n\n");
  }

  getSlackMessage() {
    return this.messages.join("\n");
  }
}
