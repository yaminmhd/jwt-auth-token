const app = require("./app");
const logger = require("./logger");

const server = app.listen(process.env.PORT || 3000, function() {
  logger.info("Listening on port " + server.address().port);
});
