var express = require('express');
var path = require('path');
var colors = require('colors');
var fs = require('fs');
var server = express();
var port = process.env.port || 9999;


server.use(express.static(path.join(__dirname, '../')));
server.set('view engine', 'ejs');

server.get('/', function (req, res) {
    res.redirect('/test/runner');
});
server.get('/test/runner', function (req, res) {
    res.render(__dirname + '/runner.ejs', {
        overflowImage: fs.readFileSync(__dirname + '/bigimage.png', 'base64')
    })
})

server.listen(port, function () {
    console.log('Test server is running, open' , 
        'http://localhost:%s/'.replace('%s', port).green.grey, 
        'in your browser');
})