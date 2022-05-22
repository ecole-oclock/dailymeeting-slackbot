/* eslint-disable import/prefer-default-export */
export const meetingStartMessage = (userId, channelId) => ({
    text:
        `Hey <!here> c'est l'heure :timer_clock:, <@${userId}> vient de démarrer le daily meeting !\n`
        + `Il te suffit de taper cliquer sur le bouton démarrer le daily meeting dans le canal <#${channelId}> pour y participer et je viendrai te poser des questions :smirk: !\n\r`
        + 'A tout de suite ! :runner:',
    blocks: [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text:
                    `Hey <!here> c'est l'heure :timer_clock:, <@${userId}> vient de démarrer le daily meeting !\n`
                    + 'Il te suffit de taper cliquer sur le bouton pour y participer et je viendrai te poser des questions :smirk: !\n\r'
                    + 'A tout de suite ! :runner:',
            },
        },
        {
            type: 'actions',
            elements: [
                {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: 'Participer au daily meeting',
                        emoji: true,
                    },
                    style: 'primary',
                    action_id: 'join_meeting',
                    value: channelId,
                },
            ],
        },
    ],
});

export const meetingSubscribeIntroduction = (channelId) => ({
    text: `Et coucou toi :wave: ! Je viens te parler pour te poser quelques questions vu que tu t'es inscrit au daily du canal <#${channelId}> :héhé: , allez commençons ! :rocket:`,
});

export const meetingMessageByStep = (step = 'yesterday') => {
    switch (step) {
        case 'yesterday':
            return { text: "Alors, t'a fais quoi hier ? :je-t-en-prie:" };
        case 'today':
            return { text: "C'est vachement intéressant tout ça ! :troll: Et aujourd'hui t'a prévu quoi ?" };
        case 'difficulties':
            return { text: "Cool ! Et t'a eu ou prévu d'avoir des difficultées particulières sinon ?" };
        default:
            return { text: 'Heuuu je sais pas où on en est en fait là ... Préviens celui qui a créé le daily meeting, y\'a visiblement un soucis !' };
    }
};

export const meetingMessageToBotButNotSubscribe = () => ({ text: "Alors c'est pas que je veux pas te parler, mais tu t'es pas inscrit à un meeting :sweat_smile:. Donc avant de venir me parler, essaye de cliquer sur le bouton `Participer au meeting` dans le canal ou j'ai normalement envoyé un message ! :see_no_evil:" });

export const meetingSubscribeValidationNext = () => ({ text: "Okay ! Et t'a fais autre chose ou je passe à la question suivante ?" });

export const meetingIsAlreadyFinished = () => ({ text: "Le daily correspondant au bouton sur lequel tu as cliqué est déjà terminé ! Donc tu n'aura pas mes questions ! :boom:" });

export const userHasNotBeenSubscribedToMeeting = () => ({ text: 'Ah bah mince l\'utilisateur ne s\'est pas inscrit à un meeting' });

export const userAlreadySubscribedToMeeting = () => ({ text: 'Heuuu, tu es déjà inscrit à un meeting en fait on va peut être pas cummuler non ?!' });

export const noStepRemaining = () => ({ text: 'Il n\'y a plus d\'étape restantes !' });
