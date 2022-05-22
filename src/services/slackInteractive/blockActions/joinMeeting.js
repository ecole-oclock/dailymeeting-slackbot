import meetingsData from 'src/utils/meetingsData';
import bot from 'src/utils/slackbot';
import {
    meetingSubscribeIntroduction,
    meetingMessageByStep,
    userAlreadySubscribedToMeeting,
} from 'src/messages';

export default (req, res, next) => async ({
    user: { id: userId },
    channel: { id: channelId },
    ...restPayload
}) => {
    const meetingChannelID = restPayload?.actions?.[0]?.value;
    try {
        if (meetingsData.isUserSubscribed(userId)) {
            bot.chat.postMessage({
                channel: userId,
                text: userAlreadySubscribedToMeeting().text,
                username: 'Daily Bot',
                as_user: true,
            });
            return res.send();
        }
        try {
            meetingsData.subscribeUserToMeeting(userId, meetingChannelID);
        } catch (error) {
            bot.chat.postMessage({
                channel: userId,
                text: error.message,
                username: 'Daily Bot',
                as_user: true,
            });
            return res.send();
        }
        //! On await pas dans le thread de la requete sinon ça prend trop de temps et on passe en timeout
        //! Par contre on doit quand même await dans une IIFE async, sinon les messages sont pas envoyés dans le bon ordre ...
        (async () => {
            await bot.chat.postMessage({
                channel: userId,
                text: meetingSubscribeIntroduction(channelId).text,
                username: 'Daily Bot',
                as_user: true,
            });
            await bot.chat.postMessage({
                channel: userId,
                text: meetingMessageByStep(meetingsData.getUserCurrentStep(userId)).text,
                username: 'Daily Bot',
                as_user: true,
            });
        })();
        return res.send();
    } catch (error) {
        return next(error);
    }
};
