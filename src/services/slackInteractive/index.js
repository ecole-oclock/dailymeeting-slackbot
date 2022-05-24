import joinMeeting from './blockActions/joinMeeting';
import talkAbout from './blockActions/talkAbout';
import finish from './blockActions/finish';
import showRecapOnChannel from './blockActions/showRecapOnChannel';

export default {
    block_actions: {
        join_meeting: joinMeeting,
        talk_about_last_day: talkAbout,
        talk_about_today: talkAbout,
        talk_about_difficulties: talkAbout,
        finish,
        show_recap_on_channel: showRecapOnChannel,
    },
};
