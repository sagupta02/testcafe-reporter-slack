// import config from './config';
// import SlackMessage from './SlackMessage';
// import LoggingLevels from './const/LoggingLevels';
// import emojis from './utils/emojis';
// import { bold, italics } from './utils/textFormatters';
// const { loggingLevel } = config;
import WebClient from "@slack/web-api";
import * as dotenv from 'dotenv';
dotenv.config();
const token = process.env.SLACK_TOKEN;
const conversationId = process.env.TESTCAFE_SLACK_CHANNEL;
console.log(token);
const testTagArray = [];
let messages = [];
const web = new WebClient(token);

const generateSection = messages => {
  // eslint-disable-next-line prettier/prettier
  const newMessage = messages.join("\n:no_entry: ");
  console.log(`*Failed tests:*\n:no_entry: ${newMessage}`);
  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*Failed tests:*\n:no_entry: ${newMessage}`
    }
  };
};

export default function () {
  return {
    noColors: true,

    reportTaskStart(startTime, userAgents, testCount) {
      /* Gets executed before all actions */
      this.startTime = startTime;
      this.testCount = testCount; // const startTimeFormatted = this.moment(this.startTime).format('M/D/YYYY h:mm:ss a');

      console.log(`Report task start is running now with ${userAgents}!!!!`);
    },

    reportFixtureStart(name, path) {
      this.currentFixtureName = name;
      console.log('Report fixture start is running now!!!!');
    },

    reportTestDone(name, testRunInfo, meta) {
      // const hasErr = !!testRunInfo.errs.length;
      this.testRunInfo = testRunInfo; // Scan the array for the value of the tag, If it exists , skip it . If not add it

      if (!testTagArray.includes(meta.testType)) {
        testTagArray.push(meta.testType);
      }
      /* here we need a local variable to store the failed test name and then push to global array of message */


      if (this.testRunInfo.errs.length > 0) {
        this.failestestname = name;
        messages.push(this.failestestname);
        console.log(this.testRunInfo.errs.length);
      }

      console.log('Report test done is running now!!!!');
      /* let message = null;
        if (testRunInfo.skipped) {
        message = `${emojis.fastForward} ${italics(name)} - ${bold('skipped')}`;
      } else if (hasErr) {
        message = `${emojis.fire} ${italics(name)} - ${bold('failed')}`;
        this.renderErrors(testRunInfo.errs);// we dont need it this is for exception
      } else {
        message = `${emojis.checkMark} ${italics(name)}` // we dont need to show pass tests
      }
        if (loggingLevel === LoggingLevels.TEST) this.slack.addMessage(message);
      },
      renderErrors(errors) {
      errors.forEach((error, id) => {
        this.slack.addErrorMessage(this.formatError(error, `${id + 1} `));
      }) */
    },

    async reportTaskDone(endTime, passed, warnings, result) {
      /*       const endTimeFormatted = this.moment(endTime).format('M/D/YYYY h:mm:ss a');
            const durationMs = endTime - this.startTime;
            const durationFormatted = this.moment
              .duration(durationMs)
              .format('h[h] mm[m] ss[s]');
      
            const finishedStr = `${emojis.finishFlag} Testing finished at ${bold(endTimeFormatted)}\n`;
            const durationStr = `${emojis.stopWatch} Duration: ${bold(durationFormatted)}\n`;
            let summaryStr = '';
      
            if (result.skippedCount) summaryStr += `${emojis.fastForward} ${bold(`${result.skippedCount} skipped`)}\n`;
      
            if (result.failedCount) {
              summaryStr += `${emojis.noEntry} ${bold(`${result.failedCount}/${this.testCount} failed`)}`
            } else {
              summaryStr += `${emojis.checkMark} ${bold(`${result.passedCount}/${this.testCount} passed`)}`
            }
      
            const message = `\n\n${finishedStr} ${durationStr} ${summaryStr}`;
      
            this.slack.addMessage(message);
            this.slack.sendTestReport(this.testCount - passed); */
      this.testResult = result;
      const blockBodyTestMessage = generateSection(messages);
      const blockBodyMain = [{
        type: 'header',
        text: {
          type: 'plain_text',
          text: ':warning: Test cafe Report Staging',
          emoji: true
        }
      }, {
        type: 'section',
        fields: [{
          type: 'mrkdwn',
          text: `*Test Tags:*\n@${testTagArray.join(' @').toString()}`
        }, {
          type: 'mrkdwn',
          text: `*Result:*\n${this.testResult.failedCount}/${this.testCount} failed`
        }]
      }, {
        type: 'divider'
      }];
      const blockBodyAction = {
        type: 'actions',
        elements: [{
          type: 'button',
          text: {
            type: 'plain_text',
            emoji: true,
            text: 'Gitlab Pipeline'
          },
          url: 'https://gitlab.usabilla.net/usabilla/dev/direct/test-cafe-shaker/-/jobs/2133149',
          value: 'click_me_123'
        }, {
          type: 'button',
          text: {
            type: 'plain_text',
            emoji: true,
            text: 'Test Report'
          },
          url: 'https://www.intranet.usabilla.nl/qa/testcafe/325287/2133149/',
          value: 'click_me_123'
        }]
      };
      blockBodyMain.push(blockBodyTestMessage);
      blockBodyMain.push(blockBodyAction); // Post a message to the channel, and await the result.

      await web.chat.postMessage({
        text: 'Hello world!',
        channel: conversationId,
        blocks: blockBodyMain
      }); // The result contains an identifier for the message, `ts`.

      console.log(`Successfully send message in conversation ${conversationId}`);
    }

  };
}