import logger from 'src/utils/logger';
import bot from 'src/utils/slackbot';
import {
    meetingMessageToBotButNotSubscribe,
    meetingMessageByStep,
    meetingSubscribeValidationNext,
} from 'src/messages';
import meetingsData from 'src/utils/meetingsData';

export default (req, res, next) => async (
    challenge,
    {
        bot_id: botId,
        client_msg_id,
        type,
        text,
        user,
        ts,
        team,
        blocks,
        channel,
        event_ts: eventTs,
        channel_type,
    },
) => {
    try {
        console.log({
            bot_id: botId,
            client_msg_id,
            type,
            text,
            user,
            ts,
            team,
            blocks,
            channel,
            event_ts: eventTs,
            channel_type,
        });
        // Si c'est un message du bot on va pas répondre au bot ...
        // Sinon boucle infini de réponsement !
        if (botId) {
            return res.send();
        }

        if (!meetingsData.isUserSubscribed(user)) {
            await bot.chat.postMessage({
                channel: user,
                text: meetingMessageToBotButNotSubscribe(),
            });
            return res.send();
        }
        // Si il répond alors et qu'on est là c'est qu'il répond à une question qu'on lui a posé
        // Il est donc à une step défini, on lui demande donc si il en a fini avec la step
        await bot.chat.postMessage({
            channel: user,
            text: meetingSubscribeValidationNext(),
        });

        // await bot.chat.postMessage({
        //     channel: user,
        //     text: meetingMessageByStep(meetingsData.getUserCurrentStep(user)),
        // });
        return res.send();
    } catch (error) {
        return next(error);
    }
};
