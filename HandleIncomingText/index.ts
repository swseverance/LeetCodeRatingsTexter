import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { parse } from "qs";
import { createInputDocument, leetCodeService, tableService } from "../shared";

const MAX_USERS = parseInt(process.env["MAX_USERS"]!);

const handleIncomingText: AzureFunction = async (
  context: Context,
  req: HttpRequest
) => {
  const setRequestBody = (body: string) => {
    context.res = {
      body,
    };
  };

  const { From: phone, Body } = parse(req.rawBody) as {
    From: string;
    Body: string;
  };
  const username = Body.trim();

  if (!username) {
    return setRequestBody(`Please provide a username`);
  }

  return leetCodeService
    .getUser(username)
    .then(({ matchedUser }) => {
      if (matchedUser) {
        if (context.bindings.documents.length >= MAX_USERS) {
          return setRequestBody(
            `Sorry! For now we are limited to ${MAX_USERS} users.`
          );
        }

        return tableService
          .upsertEntity(
            createInputDocument(matchedUser.username, phone, false, 0, "")
          )
          .then(() => {
            return setRequestBody(
              `Registered to receive updates for ${matchedUser.username}`
            );
          });
      } else {
        return setRequestBody(
          `Could not find user ${username}. Perhaps this is a LeetCode CN user which is not yet supported.`
        );
      }
    })
    .catch((e) => {
      context.log.error("Error: ", e);

      return setRequestBody("An unexpected error has occurred");
    });
};

export default handleIncomingText;
