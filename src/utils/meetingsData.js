import {
    meetingIsAlreadyFinished, stepDoesNotExists, userHasNotBeenSubscribedToMeeting,
} from 'src/messages';
import logger from 'src/utils/logger';

const steps = ['last_day', 'today', 'difficulties', 'finished'];

const stepTranslate = {
    last_day: '⏪\tLa dernière fois',
    today: "📅\tAujourd'hui",
    difficulties: '🤔\tDifficultés',
};

// const meetingsByChannel = {
//     C03ENJDQVTK: {
//         U01EEA60KJ7: {
//             last_day: [
//                 `J'ai fait un truc`,
//                 `Pis un autre`,
//                 `Et encore un autre`,
//             ],
//             today: [
//                 `Je vais faire un truc`,
//                 `Pis un autre`,
//                 `Et encore un autre`,
//             ],
//             difficulties: [
//                 `J'ai eu des difficultés`,
//                 `Et c'était compliqué`,
//                 `Mais maintenant ça va mieux !`,
//             ],
//         },
//         U03CHKNUQAW: {
//             last_day: [
//                 `J'ai fait un truc`,
//                 `Pis un autre`,
//                 `Et encore un autre`,
//             ],
//             difficulties: [
//                 `J'ai eu des difficultés`,
//                 `Et c'était compliqué`,
//                 `Mais maintenant ça va mieux !`,
//             ],
//         },
//         U03D7CM0M32: {
//             last_day: [
//                 `J'ai fait un truc`,
//                 `Pis un autre`,
//                 `Et encore un autre`,
//             ],
//         },
//         U03C32B38UF: {
//             difficulties: [
//                 `J'ai eu des difficultés`,
//                 `Et c'était compliqué`,
//                 `Mais maintenant ça va mieux !`,
//             ],
//         },
//     },
// };
// const userIdSubscription = {
//     U01EEA60KJ7: 'C03ENJDQVTK',
//     U03CHKNUQAW: 'C03ENJDQVTK',
//     U03D7CM0M32: 'C03ENJDQVTK',
//     U03C32B38UF: 'C03ENJDQVTK',
// };

// const userActiveStep = {
//     U01EEA60KJ7: 'last_day',
//     U03CHKNUQAW: 'finished',
//     U03D7CM0M32: 'finished',
//     U03C32B38UF: 'finished',
// };
// const meetingsCreators = { C03ENJDQVTK: 'U01EEA60KJ7' };

const meetingsByChannel = {};
const userIdSubscription = {};
const userActiveStep = {};
const meetingsCreators = {};

export default {
    getMeeting(channelId) {
        return meetingsByChannel[channelId] || null;
    },
    createMeeting(channelId, creatorId) {
        if (meetingsByChannel[channelId]) {
            Object.keys(meetingsByChannel[channelId]).forEach((userId) => {
                if (userIdSubscription[userId]) {
                    delete userIdSubscription[userId];
                }
                if (userActiveStep[userId]) {
                    delete userActiveStep[userId];
                }
            });
        }
        meetingsByChannel[channelId] = {};
        meetingsCreators[channelId] = creatorId;
    },
    subscribeUserToMeeting(userId, channelId) {
        if (!meetingsByChannel[channelId]) {
            throw new Error(meetingIsAlreadyFinished().text);
        }
        userIdSubscription[userId] = channelId;
        const [lastDayStepValue] = steps;
        userActiveStep[userId] = lastDayStepValue;
        meetingsByChannel[channelId][userId] = {};
    },
    isUserSubscribed(userId) {
        return !!userIdSubscription[userId];
    },
    userHasFinished(userId) {
        return userActiveStep[userId] && userActiveStep[userId] === 'finished';
    },
    addInfoToUserMeeting(userId, info) {
        const channelId = userIdSubscription[userId];
        if (!channelId) {
            throw new Error(userHasNotBeenSubscribedToMeeting().text);
        }
        if (!meetingsByChannel[channelId][userId]) {
            meetingsByChannel[channelId][userId] = {};
        }
        const step = userActiveStep[userId];
        if (!meetingsByChannel[channelId][userId][step]) {
            meetingsByChannel[channelId][userId][step] = [];
        }
        meetingsByChannel[channelId][userId][step].push(info);
    },
    getUserInfoMeeting(userId, step = null) {
        const channelId = userIdSubscription[userId];
        if (!channelId) {
            throw new Error(userHasNotBeenSubscribedToMeeting().text);
        }
        if (step) {
            return meetingsByChannel?.[channelId]?.[userId]?.[step];
        }
        return meetingsByChannel?.[channelId]?.[userId];
    },
    getUsersInfoMeeting(channelId) {
        return meetingsByChannel?.[channelId];
    },
    logMeetings() {
        logger.debug(`Meetings par canal ${JSON.stringify(meetingsByChannel)}`);
        logger.debug(`userId Subscription ${JSON.stringify(userIdSubscription)}`);
        logger.debug(`Users Steps ${JSON.stringify(userActiveStep)}`);
        logger.debug(`Créateur de canaux ${JSON.stringify(meetingsCreators)}`);
    },
    getUserChannelIdSubscribed(userId) {
        return userIdSubscription[userId];
    },
    getUserCurrentStep(userId) {
        const channelId = userIdSubscription[userId];
        if (!channelId) {
            throw new Error(userHasNotBeenSubscribedToMeeting().text);
        }
        if (userActiveStep[userId] === undefined) {
            return steps[0];
        }
        return userActiveStep[userId];
    },
    setUserStep(userId, step) {
        const [lastDayStepValue] = steps;
        if (userActiveStep[userId] === undefined) {
            userActiveStep[userId] = lastDayStepValue;
        } else if (!steps.includes(step)) {
            throw new Error(stepDoesNotExists(step).text);
        } else {
            userActiveStep[userId] = step;
        }
    },
    getUserDailyExport(userId, prefixLine = '') {
        const userInfos = this.getUserInfoMeeting(userId);
        let userResultText = '';
        // On parcours les steps ( sauf la step finished ) au cas ou l'utilisateur n'ai pas rempli une step
        steps.filter((_step) => !['finished'].includes(_step)).forEach((step) => {
            // On cherche le translate de la step
            const translatedStep = stepTranslate?.[step] ? stepTranslate?.[step] : step;
            // Si y'a des infos sur la step on les affiches
            if (userInfos[step] && Array.isArray(userInfos[step]) && userInfos[step].length) {
                userResultText += `${prefixLine}*${translatedStep}*\n`;
                userInfos[step].forEach((stepInfo) => {
                    userResultText += `${prefixLine}\t•\t ${stepInfo}\n`;
                });
            } else { // Sinon on dit que il n'y a rien à dire sur cette step
                userResultText += `${prefixLine}${translatedStep}\n${prefixLine}\t•\t Rien à dire ici\n`;
            }
            userResultText += '\n';
        });
        return userResultText;
    },
    getAllUsersDailyExport(channelId) {
        if (!meetingsByChannel[channelId]) {
            throw new Error(`Pas de daily en attente pour le channel ${channelId}`);
        }
        const channelUsers = Object.keys(meetingsByChannel[channelId]);
        const result = [];
        channelUsers.forEach((userId) => {
            result.push({
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `•\t<@${userId}>\n\r${this.getUserDailyExport(userId, '\t')}\n\r`,
                },
            });
        });
        return result;
    },
    getMeetingCreatorUserId(channelId) {
        return meetingsCreators[channelId];
    },
    getRemainingUsers(channelId) {
        const channelUsers = Object.keys(meetingsByChannel[channelId]);
        return channelUsers.filter((userId) => userActiveStep[userId] !== 'finished');
    },
};
