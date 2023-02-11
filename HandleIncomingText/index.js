const qs = require("qs");
const MAX_USERS = process.env["MAX_USERS"];
const { leetCodeService, tableService, createDocument } = require("../shared");

module.exports = function (context, req) {
  const { From: phone, Body: username } = qs.parse(req.rawBody);

  if (!username) {
    return (context.res.body = `Please provide a username`);
  }

  return leetCodeService
    .getUser(username.trim())
    .then(({ matchedUser }) => {
      if (matchedUser) {
        if (context.bindings.documents.length >= MAX_USERS) {
          return (context.res.body = `Sorry! For now we are limited to ${MAX_USERS} users.`);
        }

        return tableService
          .upsertEntity(
            createDocument(matchedUser.username, phone, false, 0, "")
          )
          .then(() => {
            context.res.body = `Registered to receive updates for ${matchedUser.username}`;
          });
      } else {
        context.res.body = `Could not find user ${username}. Perhaps this is a LeetCode CN user which is not yet supported.`;
      }
    })
    .catch((e) => {
      context.res.body = "An unexpected error has occurred";
      context.log.error("Error: ", e);
    });
};
