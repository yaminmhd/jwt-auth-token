const User = require("../model/user");
const status = require("http-status");

const registerNewUser = async (req, res) => {
  let user = new User();
  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);

  await user.save();
  return res.json({ user: { username: user.username, email: user.email } });
};

const login = async (req, res) => {
  const email = req.body.user.email;
  const password = req.body.user.password;

  let user = await User.findOne({ email });

  if (!user || !user.validPassword(password)) {
    return res.status(status.UNAUTHORIZED).json({
      error: { message: "email or password is invalid" }
    });
  }

  const token = user.generateJWT();
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: true
  });

  return res.json({
    user: { username: user.username, email: user.email }
  });
};

const changePassword = async (req, res) => {
  const userId = req.user.userid;
  console.log(userId);
  const user = await User.findById(userId);

  const newUserProfile = req.body.user;
  if (newUserProfile.password.length >= 8) {
    user.setPassword(newUserProfile.password);
  } else {
    return res.status(422).json({
      error: { message: "Password needs to be 8 character and higher" }
    });
  }

  await user.save();
  return res.json({ status: "done" });
};

const logout = async (req, res) => {
  res.clearCookie("jwt");
  res.json({ status: "done" });
};

module.exports = {
  registerNewUser,
  login,
  logout,
  changePassword
};
