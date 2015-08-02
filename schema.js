var Sequelize = require("sequelize");
var sequelize = new Sequelize('tunefuldb', "root", "");

var User = sequelize.define('User',{
  username: Sequelize.STRING,
  password: Sequelize.STRING
});

var Song = sequelize.define('Song', {
  songName: Sequelize.STRING
})

User.hasMany(Song);

Song.belongsTo(User);

User.sync();
Song.sync();

exports.User = User;
exports.Song = Song;