exports.isValidPassword = function(user, passwordGiven){
  if (user.dataValues.password === passwordGiven) {
    return true;
  } else {
    return false;
  }
}