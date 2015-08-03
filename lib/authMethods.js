exports.isValidPassword = function(user, passwordGiven, bcrypt, callback){
  bcrypt.compare(passwordGiven, user.dataValues.password, function(err, result){
    callback(result);
  });
}