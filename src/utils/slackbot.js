import { WebClient } from '@slack/web-api';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import timezone from 'dayjs/plugin/timezone';

import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.locale('fr');
dayjs.extend(localizedFormat);
dayjs.extend(timezone);
dayjs.tz.setDefault(process.env.TZ);
// An access token (from your Slack app or custom integration - xoxp, xoxb)
// const token = process.env.SLACK_USER_TOKEN; // Add a bot https://my.slack.com/services/new/bot and put the token
const token = process.env.SLACK_BOT_TOKEN; // Add a bot https://my.slack.com/services/new/bot and put the token

export default new WebClient(token);
