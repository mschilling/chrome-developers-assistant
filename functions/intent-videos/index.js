'use strict';

const defaultHandler = require('./default');
const eventHighlightsHandler = require('./event-highlights');
const speakerVideosHandler = require('./speaker-talks');

module.exports = {
  searchVideos: defaultHandler.handleAction,
  eventHighlights: eventHighlightsHandler.handleAction,
  speakerVideos: speakerVideosHandler.handleAction
};
