'use strict';

const defaultHandler = require('./default');
const speakerVideosHandler = require('./speaker-talks');

module.exports = {
  searchVideos: defaultHandler.handleAction,
  speakerVideos: speakerVideosHandler.handleAction
};
