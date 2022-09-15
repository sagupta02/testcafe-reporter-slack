# TestCafe Reporter Slack 
### System requirements
Node 10
### testcafe-reporter-slack

This is a reporter for [TestCafe](http://devexpress.github.io/testcafe). It sends the output of the test to [Slack](https://slack.com/).

## Purpose :dart:
Once configured the reporter sends test results to Slack channel, e.g.

![Slack report - success](assets/slack-report-success.png)

![Slack report - failed](assets/slack-report-failed.png)

## Installation :construction:

Install this reporter as your test project dependency:

```bash
yarn add @getfeedback/testcafe-reporter-slack
```

## Setup instructions :wrench:
In order to use this TestCafe reporter plugin, it is necessary to add it as your reporter to your TestCafe.
 
### Using `.testcaferc.json` config file

Add a reporter name (`slack`) to your `reporter` object:

```json
{
  "browsers": [ "chrome" ],
  "src": "scenarios",
  "reporter": [
    {
      "name": "slack"
    }
  ]
}
```

### Using TestCafe API

Pass the reporter name (`slack`) to the `reporter()` method:

```js
testCafe
    .createRunner()
    .src('path/to/test/file.js')
    .browsers('chrome')
    .reporter('slack') // <-
    .run();
```

### Necessary configuration

After that, you should define **.env** file with variables in your test project, hence the folder from where your call TestCafe (root directory).

```dotenv
# .env
TESTCAFE_SLACK_CHANNEL=
TESTCAFE_SLACK_USERNAME=
TESTCAFE_SLACK_LOGGING_LEVEL=
SLACK_TOKEN=
CI_PIPELINE_ID=
CI_JOB_ID=
TEST_REPORT_PATH=
```

This is **required minimum to has it working**.

## Further Documentation :books:
[TestCafe Reporter Plugins](https://devexpress.github.io/testcafe/documentation/extending-testcafe/reporter-plugin/)
