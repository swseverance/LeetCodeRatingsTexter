const { leetCodeService, parseRawDocument } = require("../shared");

module.exports = function (context) {
  const documents = context.bindings.documents.map(parseRawDocument);

  const usernames = Array.from(
    new Set(documents.map(({ username }) => username))
  );

  return leetCodeService
    .getRatings(usernames, context)
    .then((ratings) => {
      context.bindings.queue = [];

      for (const document of documents) {
        if (ratings[document.username]) {
          const { rating, badge } = ratings[document.username];

          if (rating !== document.rating) {
            context.bindings.queue.push({
              ...document,
              rating,
              badge,
            });
          }
        }
      }
    })
    .catch((e) => context.log.error("Error: ", e));
};
