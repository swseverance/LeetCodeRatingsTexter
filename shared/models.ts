interface Document {
  username: string;
  phone: string;
  leetcodeCn: boolean;
  rating: number;
  badge: string;
}

export interface OutputDocument extends Document {
  PartitionKey: string;
  RowKey: string;
}

export interface InputDocument extends Document {
  partitionKey: string;
  rowKey: string;
}

export interface RawUserContestRankingInfo {
  [username: string]: {
    rating: number;
    badge?: { name: string };
  };
}

export interface UserContestRankingInfo {
  [username: string]: {
    rating: number;
    badge: string;
  };
}

export interface RawUserPublicProfile {
  matchedUser?: { username: string };
}
