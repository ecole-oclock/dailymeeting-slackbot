import bot from 'src/utils/slackbot';
import * as messages from 'src/messages';
import meetingsData from 'src/utils/meetingsData';

export default (req, res, next) => async (
    challenge,
    {
        bot_id: botId,
        user: userId,
        ...restProps
    },
) => {
    //! On await pas les messages envoyés via l'api bot
    //! sinon l'api met trop de temps à répondre et les messages sont renvoyés par slack
    //! ce qui fait qu'on a les message en boucle infini
    try {
        // Si c'est un message du bot on va pas répondre au bot ...
        // Sinon boucle infini de réponsement !
        if (botId) {
            return res.send();
        }

        if (!meetingsData.isUserSubscribed(userId)) {
            bot.chat.postMessage({
                channel: userId,
                text: messages.meetingMessageToBotButNotSubscribe().text,
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

        meetingsData.addInfoToUserMeeting(userId, restProps.text);

        // On lui envoie un petit message pour l'inviter à continuer
        const messageValidationNextObj = messages.meetingSubscribeValidationNext(meetingsData.getUserCurrentStep(userId));
        bot.chat.postMessage({
            channel: userId,
            text: messageValidationNextObj.text,
            blocks: messageValidationNextObj.blocks,
        });

        return res.send();
    } catch (error) {
        return next(error);
    }
};
