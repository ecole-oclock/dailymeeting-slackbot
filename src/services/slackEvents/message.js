import logger from 'src/utils/logger';
import bot from 'src/utils/slackbot';

export default (req, res, next) => async (
    challenge,
    {
        bot_id,
        client_msg_id,
        type,
        text,
        user,
        ts,
        team,
        blocks,
        channel,
        event_ts,
        channel_type,
    }
) => {
    // Si c'est un message du bot on va pas répondre au bot ...
    // Sinon boucle infini de réponsement !
    if (bot_id){
        return res.send({ challenge });
    }
    await bot.chat.postMessage({
        channel: user,
        text: 'Dis m\'en plus !'
    }).catch((error) => logger.error(error.data));
    res.send({ challenge });
}