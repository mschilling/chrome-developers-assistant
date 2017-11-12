'use strict';

const eventHighlightsHandler = require('./event-highlights');
const speakerVideosHandler = require('./speaker-talks');

module.exports = {
  eventHighlights: eventHighlightsHandler.handleAction,
  speakerVideos: speakerVideosHandler.handleAction
};
