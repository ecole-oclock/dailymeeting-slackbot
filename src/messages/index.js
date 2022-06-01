const stepButtons = [
    {
        type: 'button',
        text: {
            type: 'plain_text',
            text: `⏪ Ce que j'ai fait`,
            emoji: true,
        },
        action_id: 'talk_about_last_day',
        value: 'last_day',
    },
    {
        type: 'button',
        text: {
            type: 'plain_text',
            text: `📅 Ce que je vais faire`,
            emoji: true,
        },
        action_id: 'talk_about_today',
        value: 'today',
    },
    {
        type: 'button',
        text: {
            type: 'plain_text',
            text: `🤔 Des difficultés`,
            emoji: true,
        },
        action_id: 'talk_about_difficulties',
        value: 'difficulties',
    },
];

const endButton = {
    type: 'button',
    text: {
        type: 'plain_text',
        text: `✅ J'ai terminé`,
        emoji: true,
    },
    style: 'primary',
    action_id: 'finish',
};

const getJoinMeetingButton = (channelId) => ({
    type: 'button',
    text: {
        type: 'plain_text',
        text: 'Participer au daily meeting',
        emoji: true,
    },
    style: 'primary',
    action_id: 'join_meeting',
    value: channelId,
});

const getShowRecapOnChannelButton = (channelId) => ({
    type: 'button',
    text: {
        type: 'plain_text',
        text: 'Afficher le récap sur le canal',
        emoji: true,
    },
    style: 'primary',
    action_id: 'show_recap_on_channel',
    value: channelId,
});

/* eslint-disable import/prefer-default-export */
export const meetingStartMessage = (userId, channelId) => ({
    text:
        `Hey <!here> c'est l'heure :timer_clock:, <@${userId}> vient de démarrer le daily meeting !\n`
        + `Il te suffit de cliquer sur le bouton démarrer le daily meeting dans le canal <#${channelId}> pour y participer et je viendrai te poser des questions :smirk: !\n\r`
        + 'A tout de suite ! :runner:',
    blocks: [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text:
                    `Hey <!here> c'est l'heure :timer_clock:, <@${userId}> vient de démarrer le daily meeting !\n`
                    + 'Il te suffit de cliquer sur le bouton pour y participer et je viendrai te poser des questions :smirk: !\n\r'
                    + 'A tout de suite ! :runner:',
            },
        },
        {
            type: 'actions',
            elements: [getJoinMeetingButton(channelId)],
        },
    ],
});

export const giveCreatorButtonCommands = (channelId) => ({
    text: `:wave: Coucou, tu viens de demander la création d'un meeting, ci dessous tu trouveras un pannel de bouton pour faire des actions :wink:`,
    blocks: [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `:wave: Coucou, tu viens de demander la création d'un meeting, ci dessous tu trouveras un pannel de bouton pour faire des actions :wink:`,
            },
        },
        {
            type: 'actions',
            elements: [getShowRecapOnChannelButton(channelId)],
        },
    ],
});

export const showOwnUserDailyExport = (userDailyExport) => ({
    text: `Ah t'as fini ? Ok bah voici le récap de tout ce que tu m'as dis !\n\r${userDailyExport}`,
    blocks: [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `Ah t'as fini ? Ok bah voici le récap de tout ce que tu m'as dis !\n\r${userDailyExport}`,
            },
        },
    ],
});

export const showAllUserDailyExport = (allUsersDailyExport) => ({
    text: `Et <!here> c'est l'heure ! Tout le monde a fini son récap, c'est parti pour le daily\n\r${allUsersDailyExport}`,
    blocks: [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `Et c'est l'heure ! Tout le monde a fini son récap, c'est parti pour le daily\n\r${allUsersDailyExport}`,
            },
        },
    ],
});

export const userHasFinishedHisDaily = (userId, remainingUsersId = []) => {
    const remainingUsersText = remainingUsersId.map((user) => `<@${user}>`);
    const remainingText = `\nIl reste encore ${remainingUsersText.join(', ')} qui n'ont pas fini`;
    return {
        text: `Hey :wave:, pour info, <@${userId}> vient de finir de saisir son daily. ${remainingUsersId.length ? remainingText : ''}`,
        blocks: [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `Hey :wave:, pour info, <@${userId}> vient de finir de saisir son daily. ${remainingUsersId.length ? remainingText : ''}`,
                },
            },
        ],
    };
};

export const allUsersHasFinishedTheirsDaily = (channelId) => ({
    text: `✅  Tout le monde a fini de saisir son daily ! Tu peux commencer la réunion ! :ok_hand:`,
    blocks: [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `✅  Tout le monde a fini de saisir son daily ! Tu peux commencer la réunion ! :ok_hand:`,
            },
        },
        {
            type: 'actions',
            elements: [getShowRecapOnChannelButton(channelId)],
        },
    ],
});

export const meetingSubscribeIntroduction = (channelId) => ({
    text: `Et coucou toi :wave: ! Je viens te parler pour te poser quelques questions vu que tu t'es inscrit au daily du canal <#${channelId}>`
        + ` :héhé: , allez commençons ! :rocket:\n`
        + `T'as des boutons pour savoir de quoi on parle juste sous mon message clique sur l'un d'entre eux et écris-moi un petit message `
        + `par chose que tu as faites, je compilerai tout à la fin :wink:\n\r`
        + `Alors, de quoi tu veux parler ?`,
    blocks: [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text:
                    `Et coucou toi :wave: ! Je viens te parler pour te poser quelques questions vu que tu t'es inscrit au daily du canal <#${channelId}>`
                    + ` :héhé: , allez commençons ! :rocket:\n`
                    + `T'as des boutons pour savoir de quoi on parle juste sous mon message clique sur l'un d'entre eux et écris-moi un petit message `
                    + `par chose que tu as faites, je compilerai tout à la fin :wink:\n\r`
                    + `Alors, de quoi tu veux parler ?`,
            },
        },
        {
            type: 'actions',
            elements: stepButtons,
        },
    ],
});

export const meetingMessageByStep = (step = 'yesterday') => {
    switch (step) {
        case 'last_day':
            return { text: "Alors, t'as fait quoi hier ? :je-t-en-prie:" };
        case 'today':
            return { text: "Dis-moi tout, t'as prévu quoi aujourd'hui ?" };
        case 'difficulties':
            return { text: "Ah ? T'as eu ou t'as prévu d'avoir des difficultés visiblement ! Dis m'en plus !" };
        default:
            return { text: `T'as cliqué sur quoi là ? Je reconnais pas ce bouton ! Préviens celui qui a créé le daily meeting, y'a visiblement un soucis ! 💥` };
    }
};

export const meetingMessageToBotButNotSubscribe = () => ({ text: "Alors c'est pas que je veux pas te parler, mais tu t'es pas inscrit à un meeting :sweat_smile:. Donc avant de venir me parler, essaye de cliquer sur le bouton `Participer au meeting` dans le canal ou j'ai normalement envoyé un message ! :see_no_evil:" });

export const meetingMessageUserHasAlreadyFinished = () => ({ text: "C'est pas que je veux plus te parler, mais tu m'a dis que t'avais fini de saisir ton daily donc maintenant faut attendre :grin:" });

export const meetingSubscribeValidationNext = (currentStep) => {
    const buttons = stepButtons.filter((button) => button.value !== currentStep);
    // On ajoute le bouton pour terminer le daily
    buttons.push(endButton);
    return {
        text: "Okay ! Si t'as fait autre chose, tu peux continuer de m'écrire, sinon il te suffit de cliquer sur les boutons ci-dessous :",
        blocks: [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: "Okay ! Si t'as fait autre chose, tu peux continuer de m'écrire, sinon il te suffit de cliquer sur les boutons ci-dessous :",
                },
            },
            {
                type: 'actions',
                elements: buttons,
            },
        ],
    };
};

export const meetingIsAlreadyFinished = () => ({ text: "Le daily correspondant au bouton sur lequel tu as cliqué est déjà terminé ! Donc tu n'auras pas mes questions ! :boom:" });

export const userHasNotBeenSubscribedToMeeting = () => ({ text: 'Alors avant de répondre à des questions, inscris-toi à un meeting non ? :sweat_smile:' });

export const stepDoesNotExists = (step) => ({ text: `L'étape ${step} n'est pas gérée ! T'essaies d'hacker le système ? 🤔` });

export const userAlreadySubscribedToMeeting = () => ({ text: 'Heuuu, tu es déjà inscrit à un meeting en fait on va peut être pas cummuler non ?!' });

export const noStepRemaining = () => ({ text: 'Il n\'y a plus d\'étape restantes !' });