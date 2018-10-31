const jwt = require("express-jwt");
const secret = require("../../config/jwt").secret;

const getTokenFromHeader = req => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.split(" ")[0] === "Bearer") {
    return authHeader.split(" ")[1];
  }

  return null;
};

const getTokenFromCookie = req => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

module.exports = {
  required: jwt({
    secret,
    userProperty: "user",
    getToken: getTokenFromCookie
  })
};
