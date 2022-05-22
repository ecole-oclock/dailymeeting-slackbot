import { meetingIsAlreadyFinished, noStepRemaining, userHasNotBeenSubscribedToMeeting } from 'src/messages';
import logger from 'src/utils/logger';

const steps = ['yesterday', 'today', 'difficulties'];

const meetingsByChannel = {};
const userIdSubscription = {};
const userStepsByChannel = {};

export default {
    getMeeting(channelId) {
        return meetingsByChannel[channelId] || null;
    },
    createMeeting(channelId) {
        if (meetingsByChannel[channelId]) {
            Object.keys(meetingsByChannel[channelId]).forEach((userId) => {
                if (userIdSubscription[userId]) {
                    delete userIdSubscription[userId];
                }
                if (userStepsByChannel[userId]) {
                    delete userStepsByChannel[userId];
                }
            });
        }
        meetingsByChannel[channelId] = {};
    },
    subscribeUserToMeeting(userId, channelId) {
        if (!meetingsByChannel[channelId]) {
            throw new Error(meetingIsAlreadyFinished().text);
        }
        userIdSubscription[userId] = channelId;
        meetingsByChannel[channelId][userId] = {};
    },
    isUserSubscribed(userId) {
        return !!userIdSubscription[userId];
    },
    addInfoToUserMeeting(userId, step, info) {
        const channelId = userIdSubscription[userId];
        if (!channelId) {
            throw new Error(userHasNotBeenSubscribedToMeeting().text);
        }
        if (!meetingsByChannel[channelId][userId]) {
            meetingsByChannel[channelId][userId] = {};
        }
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
    },
    getUserCurrentStep(userId) {
        const channelId = userIdSubscription[userId];
        if (!channelId) {
            throw new Error(userHasNotBeenSubscribedToMeeting().text);
        }
        if (userStepsByChannel[userId] === undefined) {
            return steps[0];
        }
        return steps[userStepsByChannel[userId]];
    },
    setUserNextStep(userId) {
        if (userStepsByChannel[userId] === undefined) {
            userStepsByChannel[userId] = 0;
        } else if (userStepsByChannel[userId] >= steps.length - 1) {
            throw new Error(noStepRemaining().text);
        } else {
            userStepsByChannel[userId] += 1;
        }
    },
};
