const Debug = require('debug');

export const debug = Debug('chrome-developer-assistant-api:debug');
export const error = Debug('chrome-developer-assistant-api:error');

// Configure logging for hosting platforms that only support console.log and console.error
debug.log = console.log.bind(console);
error.log = console.error.bind(console);
