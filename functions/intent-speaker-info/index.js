'use strict';

const admin = require('firebase-admin');
const KnownForHandler = require('./known-for');
const GithubHandleHandler = require('./github-handle');

module.exports = {
    knownFor: KnownForHandler.knownFor,
    githubHandle: GithubHandleHandler.githubHandle
};
