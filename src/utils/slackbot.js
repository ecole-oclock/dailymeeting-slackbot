import { WebClient } from '@slack/web-api';
import axios from 'axios';
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

const bot = new WebClient(token);

const getCitationBlocks = async () => {
    const blocks = [];
    const citation = await axios('https://kaamelott.chaudie.re/api/random')
        .then((result) => result.data.citation)
        .catch((e) => console.warn(e));

    if (citation) {
        blocks.push({
            type: 'context',
            elements: [
                {
                    type: 'mrkdwn',
                    text: 'Avec une petite citation ça fait pas de mal',
                },
            ],
        });
        blocks.push({
            type: 'context',
            elements: [
                {
                    type: 'mrkdwn',
                    text: `>${citation.citation.replace(/[\(\)]/gm, '_').replace(/\'\'/gm, '"').replace(/\\n/gm, '')}`,
                },
            ],
        });
        blocks.push({
            type: 'context',
            elements: [
                {
                    type: 'mrkdwn',
                    text: `_${citation.infos.personnage} - ${citation.infos.saison} - ${citation.infos.episode}_`,
                },
            ],
        });
    }
    return blocks;
};
const sendMessage = (conversationId) => {
    const blocks = [{
        type: 'header',
        text: {
            type: 'plain_text',
            text: ':newspaper:  Petit test de titre  :newspaper:',
        },
    },
    {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: '*Et là* une section',
        },
    }];
    blocks.push({
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: '*Et voilà ! Passe une bonne journée !*',
        },
    });
    blocks.push({
        type: 'divider',
    });
    return bot.chat.postMessage({ channel: conversationId, blocks }).catch((error) => console.log(error.data));
};
// (async () => {
//     const conversationId = process.env.SLACk_PUBLISH_CHANNEL_ID
//     // Tentative de rejoindre le channel, si on est déjà dessus, il se passe rien
//     await web.conversations.join({ channel: conversationId });
//     await sendMessage(conversationId);
// })();

export default bot;
