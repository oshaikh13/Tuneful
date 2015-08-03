/**
 * File Uploading and Streaming with BinaryJS
 */
'use strict';

var BinaryServer, express, http, path, app, audio, server, 
bs, db, cookieParser, bodyParser, session, passport, 
LocalStrategy, userMethods, bcrypt;

BinaryServer  = require('binaryjs').BinaryServer;
express       = require('express');
http          = require('http');
path          = require('path');
app           = express();
audio         = require('./lib/audio');
db            = require('./schema.js');
cookieParser  = require('cookie-parser');
bodyParser    = require('body-parser');
session       = require('express-session');
passport      = require('passport');
LocalStrategy = require('passport-local').Strategy;
userMethods   = require('./lib/authMethods.js');
bcrypt        = require('bcrypt-nodejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.engine('html', require('./lib/htmlEngine.js'));
app.set('view engine', 'html');

app.use(cookieParser());
app.use(session({ secret: 'hahahahahahagetshrektm9' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions



passport.use(new LocalStrategy(
  function(username, password, done) {
    db.User.findOne({ where: {username: username} }).then(function(user) {
        if (!user) {
          return done(null, false);
        }

        if (!userMethods.isValidPassword(user, password, bcrypt)) {
          return done(null, false);
        }

        return done (null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user.dataValues.id);

});

passport.deserializeUser(function(id, done) {
    db.User.findOne({
      where: {
        id: id
      }
    }).then(function(user){
        done(null, user);
    });
});


require('./lib/routes.js')(app, passport, db, bcrypt);

app.use(express.static(__dirname + '/views'));

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
