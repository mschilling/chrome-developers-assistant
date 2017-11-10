'use strict';

const responses = require('../helpers/responses');
const api = require('../helpers/api');

// Context Parameters
const EVENT_KEY_PARAM = 'event-key';

function keynoteVideoHandler(assistant) {
    const eventKey = assistant.getArgument(EVENT_KEY_PARAM);
    api.getKeynoteVideo(eventKey, null)
        .then( result => {
        if (result) {
            const params = {
              videoId: result.videoId,
              videoTitle: result.name
            };
            responses.responseIntentKeynoteVideo(assistant, true, params);
        } else {
            responses.responseIntentKeynoteVideo(assistant, false);
        }
    });
}

module.exports = {
  keynoteVideo: keynoteVideoHandler
};
