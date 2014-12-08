var chai = require('chai');
// var localStorage = require('localStorage');
var LS = require('node-localstorage').LocalStorage;
var localStorage = new LS('./test/tmp/scratch');

global.window = global;
window.assert = chai.assert;
window.localStorage = localStorage;
window.bigContent = require('fs').readFileSync('./test/bigimage.png', 'base64');
require('./tmp/storage.js');

var storage = window.storage;
require('./spec.js')