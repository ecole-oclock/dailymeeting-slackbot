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
    //! On await pas les messages envoyés via l'api bot
    //! sinon l'api met trop de temps à répondre et les messages sont renvoyés par slack
    //! ce qui fait qu'on a les message x10
    try {
        // Si c'est un message du bot on va pas répondre au bot ...
        // Sinon boucle infini de réponsement !
        if (botId) {
            return res.send();
        }

        if (!meetingsData.isUserSubscribed(user)) {
            bot.chat.postMessage({
                channel: user,
                text: meetingMessageToBotButNotSubscribe().text,
            });
            return res.send();
        }
        // Si il répond alors et qu'on est là c'est qu'il répond à une question qu'on lui a posé
        // Il est donc à une step défini, on lui demande donc si il en a fini avec la step
        bot.chat.postMessage({
            channel: user,
            text: meetingSubscribeValidationNext().text,
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
