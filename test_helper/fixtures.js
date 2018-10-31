const loadFixture = require("mongoose-fixture-loader");
const User = require("../src/model/user.js");

const fixtures = {};

const getNewUser = (username, email, password) => {
  const user = new User({
    username: username,
    email: email
  });

  user.setPassword(password);

  return user;
};

const createNewUser = async userName => {
  const password = "mypassword";
  const user = await loadFixture(
    User,
    getNewUser(userName, `${userName}@example.com`, password)
  );
  user.password = password;
  return user;
};

async function loadFixtures() {
  fixtures.users = {};
  const userNames = ["tom", "jacky"];
  for (let userName of userNames) {
    let user = await createNewUser(userName);
    fixtures.users[userName] = user;
  }
}

module.exports = {
  fixtures,
  load: loadFixtures
};
