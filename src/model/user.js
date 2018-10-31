const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { secret } = require("../../config/jwt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    index: true,
    unique: true,
    required: [true, "cannot be blank"],
    lowercase: true
  },

  email: {
    type: String,
    index: true,
    unique: true,
    required: [true, "cannot be blank"],
    lowercase: true
  },
  passwordHash: {
    type: String
  },
  passwordSalt: {
    type: String
  }
});

userSchema.plugin(uniqueValidator, { message: "should be unique" });

const generateSalt = () => {
  return crypto.randomBytes(16).toString("hex");
};

const hashPassword = (password, salt) => {
  return crypto
    .pbkdf2Sync(password, salt, 10000, 512, "sha512")
    .toString("hex");
};

userSchema.methods.setPassword = function(password) {
  this.passwordSalt = generateSalt();
  this.passwordHash = hashPassword(password, this.passwordSalt);
};

userSchema.methods.validPassword = function(password) {
  return this.passwordHash === hashPassword(password, this.passwordSalt);
};

userSchema.methods.generateJWT = function() {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      userid: this._id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000)
    },
    secret
  );
};

userSchema.methods.verifyJWT = function(token) {
  try {
    jwt.verify(token, secret);
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = mongoose.model("User", userSchema);
