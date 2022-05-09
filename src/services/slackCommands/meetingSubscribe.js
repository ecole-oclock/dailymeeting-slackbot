import {
    meetingSubscribeIntroduction,
    meetingMessageByStep,
} from 'src/messages';
import meetingsData from 'src/utils/meetingsData';
import logger from 'src/utils/logger';
import bot from 'src/utils/slackbot';

export default (req, res, next) => async ({
    token,
    channel_id: channelId,
    channel_name: channelName,
    user_id: userId,
    user_name: userName,
    command,
    text,
}) => {
    try {
        if (meetingsData.isUserSubscribed(userId)) {
            return res.send('Heuuu, tu es déjà inscrit à un meeting en fait on va peut être pas cummuler non ?!');
        }
        try {
            meetingsData.subscribeUserToMeeting(userId, channelId);
        } catch (error) {
            return res.send(error.message);
        }
        await bot.chat.postMessage({
            channel: userId,
            text: meetingSubscribeIntroduction(channelId),
            username: 'Daily Bot',
            as_user: true,
        });
        await bot.chat.postMessage({
            channel: userId,
            text: meetingMessageByStep(meetingsData.getUserCurrentStep(userId)),
            username: 'Daily Bot',
            as_user: true,
        });
        return res.send();
        // res.send(`Execution de la commande meetingSubscribe avec le texte ${text}`);
    } catch (error) {
        return next(error);
    }
};
