#!/usr/bin/env node

var bones = require('bones');

// Ensure these plugins are available early.
// TODO

bones.load(__dirname);

if (!module.parent) {
    require('bones').start();
}
