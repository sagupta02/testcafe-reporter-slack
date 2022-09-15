import { WebClient } from "@slack/web-api";

import * as dotenv from 'dotenv';
dotenv.config()

const token = process.env.SLACK_TOKEN;
const conversationId = process.env.TESTCAFE_SLACK_CHANNEL;
const gitlabPipelineId = process.env.CI_PIPELINE_ID;
const gitlabJobId = process.env.CI_JOB_ID;
const testReportBasePath = process.env.TEST_REPORT_BASE_PATH;

const testTagArray = [];
let messages = [];

const web = new WebClient(token);

const generateSection = (messages) => {
  const newMessage = messages.join("\n:no_entry: ");
  console.log(`*Failed tests:*\n:no_entry: ${newMessage}`);
  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*Failed tests:*\n:no_entry: ${newMessage}`,
    },
  };
};

export default function () {
  return {

    noColors: true,

    reportTaskStart(startTime, userAgents, testCount) {
      /* Gets executed before all actions */
      this.startTime = startTime;
      this.testCount = testCount;

      console.log(`Report task start is running now with ${userAgents}!!!!`);
    },

    reportFixtureStart(name, path) {
      /* Gets executed before each fixture */
      this.currentFixtureName = name;

      console.log('Report fixture start is running now!!!!');
    },

    reportTestDone(name, testRunInfo, meta) {
      /* Gets executed after execution of each test */

      this.testRunInfo = testRunInfo;
      // Scan the array for the value of the tag, If it exists , skip it . If not add it
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
    },

    reportTaskDone(endTime, passed, warnings,result) {
      /* Gets executed after execution of all tests and fixtures */
      this.testResult = result;
      let blockBodyAction, blockBodyMain, blockBodyTestMessage;
      blockBodyTestMessage = generateSection(messages);

      blockBodyMain = [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: ':warning: Test cafe Report Staging',
            emoji: true,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Test Tags:*\n@${testTagArray.join(' @').toString()}`,
            },
            {
              type: 'mrkdwn',
              text: `*Result:*\n${this.testResult.failedCount}/${this.testCount} failed`,
            },
          ],
        },
        {
          type: 'divider',
        },
      ];

      blockBodyAction = {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              emoji: true,
              text: 'Gitlab Job',
            },
            url: `https://gitlab.usabilla.net/usabilla/dev/direct/test-cafe-shaker/-/jobs/${gitlabJobId}`,
            value: 'click_me_123',
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              emoji: true,
              text: 'Test Report',
            },
            url: `${testReportBasePath}/${gitlabPipelineId}/${gitlabJobId}`,
            value: 'click_me_123',
          },
        ],
      };

      blockBodyMain.push(blockBodyTestMessage);
      blockBodyMain.push(blockBodyAction);
      
      // Post a message to the channel, and await the result.
      web.chat.postMessage({
        text: 'Hello world!',
        channel: conversationId,
        blocks: blockBodyMain,
      });

      console.log(
        `Successfully send message in conversation ${conversationId}`
      );
    }
  }
}
