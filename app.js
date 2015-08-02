/**
 * File Uploading and Streaming with BinaryJS
 */
'use strict';

var BinaryServer, express, http, path, app, audio, server, bs;

BinaryServer = require('binaryjs').BinaryServer;
express      = require('express');
http         = require('http');
path         = require('path');
app          = express();
audio        = require('./lib/audio');

// all environments
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

server = http.createServer(app);

server.listen(process.env.PORT || 3000, function () {
    console.log('audio Server started on http://0.0.0.0:3000');
});

bs = new BinaryServer({server: server});

bs.on('connection', function (client) {
    client.on('stream', function (stream, meta) {
        switch(meta.event) {
            // list available audios
            case 'list':
                audio.list(stream, meta);
                break;

            // request for a audio
            case 'request':
                audio.request(client, meta);
                break;

            // attempt an upload
            case 'upload':
            default:
                audio.upload(stream, meta);
        }
    });
});
