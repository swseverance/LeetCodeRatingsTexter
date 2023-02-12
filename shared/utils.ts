import { InputDocument, OutputDocument } from "./models";

export const convertOutputDocumentsToInputDocuments = (
  outputDocuments: OutputDocument[]
): InputDocument[] =>
  outputDocuments.map(
    ({ PartitionKey: partitionKey, RowKey: rowKey, ...doc }) => ({
      ...doc,
      partitionKey,
      rowKey,
    })
  );

export const createInputDocument = (
  username: string,
  phone: string,
  leetcodeCn: boolean,
  rating: number,
  badge: string
): InputDocument => ({
  partitionKey: "Leetcode",
  rowKey: `${username}:${phone}`,
  badge,
  leetcodeCn,
  phone,
  username,
  rating,
});

export const createTwilioMessage = ({
  username,
  phone: to,
  badge,
  rating,
}: InputDocument): { to: string; body: string } => {
  return {
    to,
    body: `LeetCode contest status for ${username}: Rating=${rating}${
      badge ? ", Badge=" + badge : ""
    }`,
  };
};
