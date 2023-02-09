const { tableService, createTwilioMessage } = require("../shared");

module.exports = function (context, document) {
  return tableService
    .updateEntity(document, "Replace")
    .then(() => {
      context.bindings.twilio = createTwilioMessage(document);
    })
    .catch((e) => context.log.error("Error: ", e));
};
