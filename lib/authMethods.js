exports.isValidPassword = function(user, passwordGiven){
  bcrypt.compare(passwordGiven, user.dataValues.password, function(err, result){

  });
}