'use strict';

const defaultHandler = require('./default');

module.exports = {
  searchVideos: defaultHandler.handleAction,
  selectVideoByOption: defaultHandler.selectVideoByOption
};
