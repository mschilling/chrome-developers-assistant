'use strict';

const speakerInfoHandler = require('./speaker-info');

module.exports = {
  speakerInfo: speakerInfoHandler.handleAction,
};
