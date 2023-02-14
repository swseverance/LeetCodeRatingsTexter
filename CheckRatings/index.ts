import { AzureFunction, Context } from "@azure/functions";
import {
  leetCodeService,
  convertOutputDocumentsToInputDocuments,
  InputDocument,
} from "../shared";

const checkRatings: AzureFunction = async (context: Context) => {
  const inputDocuments = convertOutputDocumentsToInputDocuments(
    context.bindings.documents
  );

  const usernames = Array.from(
    new Set(inputDocuments.map(({ username }) => username))
  );

  return leetCodeService
    .getRatings(usernames)
    .then((ratings) => {
      const queue: InputDocument[] = [];

      for (const document of inputDocuments) {
        if (ratings[document.username]) {
          const { rating, badge } = ratings[document.username];

          if (rating !== document.rating) {
            queue.push({
              ...document,
              rating,
              badge,
            });
          }
        }
      }

      context.bindings.queue = queue;
    })
    .catch((e) => {
      context.log.error("Error: ", e);

      throw e;
    });
};

export default checkRatings;
