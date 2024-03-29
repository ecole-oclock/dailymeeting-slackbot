import meetingsData from 'src/utils/meetingsData';
import bot from 'src/utils/slackbot';
import {
    meetingSubscribeIntroduction,
    meetingMessageByStep,
    userAlreadySubscribedToMeeting,
    meetingMessageUserHasAlreadyFinished,
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
        if (meetingsData.userHasFinished(userId)) {
            bot.chat.postMessage({
                channel: userId,
                text: meetingMessageUserHasAlreadyFinished().text,
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
        const meetingSubscribeIntroductionObj = meetingSubscribeIntroduction(channelId);
        bot.chat.postMessage({
            channel: userId,
            text: meetingSubscribeIntroductionObj.text,
            blocks: meetingSubscribeIntroductionObj.blocks,
            username: 'Daily Bot',
            as_user: true,
        });
        return res.send();
    } catch (error) {
        return next(error);
    }
};
