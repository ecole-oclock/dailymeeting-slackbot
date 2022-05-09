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
            console.log('before', { userIdSubscription, keys: Object.keys(meetingsByChannel[channelId]) });
            Object.keys(meetingsByChannel[channelId]).forEach((userId) => {
                console.log({ userId });
                if (userIdSubscription[userId]) {
                    delete userIdSubscription[userId];
                }
                if (userStepsByChannel[userId]) {
                    delete userStepsByChannel[userId];
                }
            });

            console.log('after', { userIdSubscription });
        }
        meetingsByChannel[channelId] = {};
    },
    subscribeUserToMeeting(userId, channelId) {
        if (!meetingsByChannel[channelId]) {
            throw new Error('On s\'inscrit pas avant que quelqu\'un ai lancé le daily non ? Ça fait mauvais genre !');
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
            throw new Error('Ah bah mince l\'utilisateur ne s\'est pas inscrit à un meeting');
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
            throw new Error('Ah bah mince l\'utilisateur ne s\'est pas inscrit à un meeting');
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
        console.log({
            meetingsByChannel,
            userIdSubscription,
        });
    },
    getUserCurrentStep(userId) {
        const channelId = userIdSubscription[userId];
        if (!channelId) {
            throw new Error('Ah bah mince l\'utilisateur ne s\'est pas inscrit à un meeting');
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
            throw new Error('Il n\'y a plus d\'étape, il a fini le gus !');
        } else {
            userStepsByChannel[userId] += 1;
        }
    },
};
