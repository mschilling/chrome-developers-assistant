'use strict';

const eventHighlightsHandler = require('./event-highlights');

module.exports = {
  eventHighlights: eventHighlightsHandler.handleAction,
};
