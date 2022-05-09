/* eslint-disable import/prefer-default-export */
export const meetingStartMessage = (userId, channelId) => (
    `Hey <!here> c'est l'heure :timer_clock:, <@${userId}> vient de démarrer le daily meeting !\n`
    + `Il te suffit de taper la commande \`/meeting-subscribe\` dans le canal <#${channelId}> pour y participer et je viendrai te poser des questions :smirk: !\n\r`
    + 'A tout de suite ! :runner:'
);

export const meetingSubscribeIntroduction = (channelId) => (
    `Et coucou toi :wave: ! Je viens te parler pour te poser quelques questions vu que tu t'es inscrit au daily du canal <#${channelId}> :héhé: , allez commençons ! :rocket:`
);

export const meetingMessageByStep = (step = 'yesterday') => {
    switch (step) {
    case 'yesterday':
        return 'Alors, t\'a fais quoi hier ? :je-t-en-prie:';
    case 'today':
        return 'C\'est vachement intéressant tout ça ! :troll: Et aujourd\'hui t\'a prévu quoi ?';
    case 'difficulties':
        return 'Cool ! Et t\'a eu ou prévu d\'avoir des difficultées particulières sinon ?';
    default:
        return 'Heuuu je sais pas où on en est en fait là ... Préviens celui qui a créé le daily meeting !';
    }
};

export const meetingMessageToBotButNotSubscribe = () => (
    'Alors c\'est pas que je veux pas te parler, mais tu t\'es pas inscrit à un meeting :sweat_smile:. Alors avant de venir me parler, essaye de taper la commande `/meeting-subscribe` dans le canal ou j\'ai normalement envoyé un message ! :see_no_evil:'
);

export const meetingSubscribeValidationNext = () => (
    'Okay ! Et t\'a fais autre chose ou je passe à la question suivante ?'
);
