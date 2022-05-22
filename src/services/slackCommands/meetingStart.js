import bot from 'src/utils/slackbot';
import { meetingStartMessage } from 'src/messages';
import meetingsData from 'src/utils/meetingsData';

export default (req, res, next) => async ({
    channel_id: channelId,
    user_id: userId,
}) => {
    try {
        const messageObj = meetingStartMessage(userId, channelId);
        meetingsData.createMeeting(channelId);
        // On await pas, sinon la commande slack passe en timeout
        bot.chat.postMessage({
            channel: `${channelId}`,
            text: messageObj.text,
            blocks: messageObj.blocks,
            username: 'Daily Bot',
            as_user: true,
        });
        return res.send();
    } catch (error) {
        return next(error);
    }
};
