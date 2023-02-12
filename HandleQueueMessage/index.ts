import { AzureFunction } from "@azure/functions";
import { createTwilioMessage, InputDocument, tableService } from "../shared";

const handleQueueMessage: AzureFunction = async (
  context,
  document: InputDocument
) => {
  return tableService
    .updateEntity(document, "Replace")
    .then(() => {
      context.bindings.twilio = createTwilioMessage(document);
    })
    .catch((e) => context.log.error("Error: ", e));
};

export default handleQueueMessage;
