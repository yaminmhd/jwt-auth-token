require("dotenv").config();

const getJWTSigningSecret = () => {
  const secret = process.env.JWT_SIGNING_TOKEN;

  if (!secret) {
    throw new Error("Missing secrets to sign JWT token");
  }

  return secret;
};

module.exports = {
  secret: getJWTSigningSecret()
};
