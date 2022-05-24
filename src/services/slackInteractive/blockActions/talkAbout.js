import meetingsData from 'src/utils/meetingsData';
import bot from 'src/utils/slackbot';
import {
    meetingMessageByStep,
    meetingMessageUserHasAlreadyFinished,
    userAlreadySubscribedToMeeting,
    userHasNotBeenSubscribedToMeeting,
} from 'src/messages';
import logger from 'src/utils/logger';

export default (req, res, next) => async ({
    user: { id: userId },
    ...restPayload
}) => {
    const step = restPayload?.actions?.[0]?.value;
    try {
        if (!meetingsData.isUserSubscribed(userId)) {
            bot.chat.postMessage({
                channel: userId,
                text: userHasNotBeenSubscribedToMeeting().text,
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
            meetingsData.setUserStep(userId, step);
        } catch (error) {
            logger.error(error.stack);
            bot.chat.postMessage({
                channel: userId,
                text: error.message,
                username: 'Daily Bot',
                as_user: true,
            });
            return res.send();
        }
        //! On await pas dans le thread de la requete sinon ça prend trop de temps et on passe en timeout
        const meetingMessageByStepObj = meetingMessageByStep(step);
        bot.chat.postMessage({
            channel: userId,
            text: meetingMessageByStepObj.text,
            blocks: meetingMessageByStepObj.blocks,
            username: 'Daily Bot',
            as_user: true,
        });
        return res.send();
    } catch (error) {
        return next(error);
    }
};
