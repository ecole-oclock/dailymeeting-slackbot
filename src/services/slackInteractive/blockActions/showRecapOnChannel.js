import meetingsData from 'src/utils/meetingsData';
import bot from 'src/utils/slackbot';
import * as messages from 'src/messages';
import logger from 'src/utils/logger';

export default (req, res, next) => async ({
    user: { id: userId },
    ...restPayload
}) => {
    try {
        const meetingChannelID = restPayload?.actions?.[0]?.value;
        logger.info(`Affichage du récap du daily dans le canal ${meetingChannelID}`);

        const userDailyExport = meetingsData.getAllUsersDailyExport(meetingChannelID);
        const userDailyExportMessage = messages.showAllUserDailyExport(userDailyExport);
        bot.chat.postMessage({
            channel: meetingChannelID,
            text: userDailyExportMessage.text,
            blocks: userDailyExportMessage.blocks,
            username: 'Daily Bot',
            as_user: true,
        }).catch((error) => logger.error(error.message));
        return res.send();
    } catch (error) {
        return next(error);
    }
};
