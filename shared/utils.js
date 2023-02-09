/**
 * RawDocument is what actually gets stored in Azure table
 *
 * interface RawDocument {
 *   PartitionKey: string;
 *   RowKey: string;
 *   username: string;
 *   phone: string;
 *   leetcodeCn: boolean;
 *   rating: number;
 *   badge: string;
 * }
 *
 * interface Document {
 *   partitionKey: string;
 *   rowKey: string;
 *   username: string;
 *   phone: string;
 *   leetcodeCn: boolean;
 *   rating: number;
 *   badge: string;
 * }
 */

// returns Document
const createDocument = (username, phone, leetcodeCn, rating, badge) => {
  username = username.trim();

  return {
    partitionKey: "Leetcode",
    rowKey: `${username}:${phone}`,
    badge,
    leetcodeCn,
    phone,
    username,
    rating,
  };
};

// Converts RawDocument to Document
const parseRawDocument = ({
  PartitionKey: partitionKey,
  RowKey: rowKey,
  ...document
}) => ({
  ...document,
  partitionKey,
  rowKey,
});

const createTwilioMessage = ({ username, phone: to, badge, rating }) => {
  return {
    to,
    body: `LeetCode contest status for ${username}: Rating=${rating}${
      badge ? ", Badge=" + badge : ""
    }`,
  };
};

module.exports = {
  createDocument,
  parseRawDocument,
  createTwilioMessage,
};
