
function getSafeUser(user, result={}) {
    result.id = user.id;
    result.firstName = user.firstName;
    result.lastName = user.lastName;
    result.email = user.email;
    result.username = user.username;
    return result;
  }
  module.exports = { getSafeUser };
