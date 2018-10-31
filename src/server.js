const app = require("./app");
const logger = require("./logger");
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://localhost/jwt-token-auth",
  { useNewUrlParser: true }
);
const db = mongoose.connection;
db.once("open", () => {
  console.log("Database is connected");
});
db.on("error", error => {
  console.error("An error occurred", error);
});

const server = app.listen(process.env.PORT || 3000, function() {
  logger.info("Listening on port " + server.address().port);
});
