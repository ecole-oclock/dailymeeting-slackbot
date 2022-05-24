import meetingsData from 'src/utils/meetingsData';
import bot from 'src/utils/slackbot';
import * as messages from 'src/messages';
import logger from 'src/utils/logger';

export default (req, res, next) => async ({
    user: { id: userId },
}) => {
    try {
        if (!meetingsData.isUserSubscribed(userId)) {
            bot.chat.postMessage({
                channel: userId,
                text: messages.userHasNotBeenSubscribedToMeeting().text,
                username: 'Daily Bot',
                as_user: true,
            });
            return res.send();
        }

        if (meetingsData.userHasFinished(userId)) {
            bot.chat.postMessage({
                channel: userId,
                text: messages.meetingMessageUserHasAlreadyFinished().text,
            });
            return res.send();
        }

        logger.info(`L'utilisateur ${userId} vient de finir de saisir son daily`);
        meetingsData.setUserStep(userId, 'finished');

        (async () => {
            const userDailyExport = meetingsData.getUserDailyExport(userId);
            const userDailyExportMessage = messages.showOwnUserDailyExport(userDailyExport);
            await bot.chat.postMessage({
                channel: userId,
                text: userDailyExportMessage.text,
                blocks: userDailyExportMessage.blocks,
                username: 'Daily Bot',
                as_user: true,
            });
            const subscribedChannelId = meetingsData.getUserChannelIdSubscribed(userId);
            const meetingCreatorId = meetingsData.getMeetingCreatorUserId(subscribedChannelId);

            // Envoi un message à créateur du daily pour le tenir au courant que quelqu'un vient de terminer
            const remainingUsers = meetingsData.getRemainingUsers(subscribedChannelId);
            if (meetingCreatorId !== userId) {
                const userHasFinishedHisDailyMessage = messages.userHasFinishedHisDaily(userId, remainingUsers);
                await bot.chat.postMessage({
                    channel: meetingCreatorId,
                    text: userHasFinishedHisDailyMessage.text,
                    blocks: userHasFinishedHisDailyMessage.blocks,
                    username: 'Daily Bot',
                    as_user: true,
                });
            }
            if (!remainingUsers.length) {
                const allUsersHasFinishedTheirsDailyMessage = messages.allUsersHasFinishedTheirsDaily(subscribedChannelId);
                bot.chat.postMessage({
                    channel: meetingCreatorId,
                    text: allUsersHasFinishedTheirsDailyMessage.text,
                    blocks: allUsersHasFinishedTheirsDailyMessage.blocks,
                    username: 'Daily Bot',
                    as_user: true,
                });
            }
        })();
        return res.send();
    } catch (error) {
        return next(error);
    }
};
