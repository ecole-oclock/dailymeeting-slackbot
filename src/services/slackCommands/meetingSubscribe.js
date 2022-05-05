import logger from 'src/utils/logger';
import bot from 'src/utils/slackbot';

export default (req, res, next) => async ({
    token,
    team_id,
    team_domain,
    channel_id,
    channel_name,
    user_id,
    user_name,
    command,
    text,
    api_app_id,
    is_enterprise_install,
    response_url,
    trigger_id,
}) => {
    logger.debug({
        token,
        team_id,
        team_domain,
        channel_id,
        channel_name,
        user_id,
        user_name,
        command,
        text,
        api_app_id,
        is_enterprise_install,
        response_url,
        trigger_id,
    })
    await bot.chat.postMessage({ 
        channel: user_id, 
        text: 'Et coucou toi tu m\'a sollicité ?',
        username: 'Daily Bot',
        as_user: true,
    })
    .then(logger.info)
    .catch((error) => logger.error(error.data));
    res.send();
    // res.send(`Execution de la commande meetingSubscribe avec le texte ${text}`);
}