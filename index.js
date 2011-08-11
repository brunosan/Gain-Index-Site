#!/usr/bin/env node

require('bones-document');
require('bones-admin');
require('bones-auth');

var bones = require('bones');

// Ensure these plugins are available early.
require('./commands/import');
require('./views/View');
require('./views/App');
require('./views/Main');
require('./views/Main.server');

bones.load(__dirname);

if (!module.parent) {
    require('bones').start();
}
