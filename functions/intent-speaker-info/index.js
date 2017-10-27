'use strict';

const admin = require('firebase-admin');
const KnownForHandler = require('./known-for');

module.exports = {
    knownFor: KnownForHandler.knownFor
};
