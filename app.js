/**
 * File Uploading and Streaming with BinaryJS
 */
'use strict';

var BinaryServer, express, http, path, app, audio, server, bs, db, cookieParser, bodyParser, session, passport;

BinaryServer = require('binaryjs').BinaryServer;
express      = require('express');
http         = require('http');
path         = require('path');
app          = express();
audio        = require('./lib/audio');
db           = require('./schema.js');
cookieParser = require('cookie-parser');
bodyParser   = require('body-parser');
session      = require('express-session');
passport     = require('passport');


// all environments
//app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(bodyParser.json());
//app.use(express.urlencoded());
//app.use(express.methodOverride());

app.engine('html', require('./lib/htmlEngine.js'));
app.set('view engine', 'html');

app.use(cookieParser());
app.use(session({ secret: 'hahahahahahagetshrektm9' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(express.static(__dirname + '/views'));

require('./lib/routes.js')(app, passport);

// development only
// if ('development' == app.get('env')) {
//     app.use(express.errorHandler());
// }

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
