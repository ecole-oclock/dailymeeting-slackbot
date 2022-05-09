import logger from 'src/utils/logger';
import bot from 'src/utils/slackbot';
import { meetingStartMessage } from 'src/messages';
import meetingsData from 'src/utils/meetingsData';

export default (req, res, next) => async ({
    token,
    team_id: teamId,
    team_domain: teamDomain,
    channel_id: channelId,
    channel_name: channelName,
    user_id: userId,
    user_name: userName,
    command,
    text,
}) => {
    // logger.debug({
    //     token,
    //     team_id: teamId,
    //     team_domain: teamDomain,
    //     channel_id: channelId,
    //     channel_name: channelName,
    //     user_id: userId,
    //     user_name: userName,
    //     command,
    //     text,
    // });
    try {
        meetingsData.createMeeting(channelId);
        await bot.chat.postMessage({
            channel: `${channelId}`,
            text: meetingStartMessage(userId, channelId),
            username: 'Daily Bot',
            as_user: true,
        });
        return res.send();
    } catch (error) {
        return next(error);
    }
};
