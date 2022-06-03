/* eslint-disable no-unused-expressions */
import bot from 'src/utils/slackbot';
import * as messages from 'src/messages';
import meetingsData from 'src/utils/meetingsData';
import logger from 'src/utils/logger';

export default (req, res, next) => async ({
    channel_id: channelId,
    user_id: userId,
}) => {
    try {
        const messageObj = messages.meetingStartMessage(userId, channelId);
        logger.debug(`Tentative de join du channel ${channelId}`);
        meetingsData.createMeeting(channelId, userId);
        (async () => {
            await bot.conversations.join({ channel: channelId }).catch((error) => { logger.warn(error.message); });
            // On await pas, sinon la commande slack passe en timeout
            bot.chat.postMessage({
                channel: `${channelId}`,
                text: messageObj.text,
                blocks: messageObj.blocks,
                username: 'Daily Bot',
                as_user: true,
            }).catch((error) => { logger.error(error.message); });
            const messageCreatorButton = messages.giveCreatorButtonCommands(channelId);
            // On await pas, sinon la commande slack passe en timeout
            bot.chat.postMessage({
                channel: `${userId}`,
                text: messageCreatorButton.text,
                blocks: messageCreatorButton.blocks,
                username: 'Daily Bot',
                as_user: true,
            }).catch((error) => { logger.error(error.message); });
        })();
        return res.send();
    } catch (error) {
        return next(error);
    }
};
