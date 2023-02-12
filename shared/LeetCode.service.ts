import axios from "axios";
import { chunk } from "lodash";
import { RawUserContestRankingInfo, RawUserPublicProfile, UserContestRankingInfo } from "./models";

const GET_RATINGS_BATCH_SIZE = parseInt(process.env["GET_RATINGS_BATCH_SIZE"]!);
const GRAPHQL_URL = process.env["GRAPHQL_URL"];

const createQueryForRatings = (usernames: string[]) => {
  const createQueryForUsername = (username: string) => `
    ${username}: userContestRanking(username: "${username}") {
      rating
      badge {
        name
      }
    }
  `;

  return `
    query userContestRankingInfo {
      ${usernames.map(createQueryForUsername).join("")}
    }
  `;
};

const createQueryForUserPublicProfile = (username: string) => `
  query userPublicProfile {
    matchedUser(username: "${username}") {
      username
    }
  }
`;

class LeetCodeService {
  async getRatings(usernames: string[]): Promise<UserContestRankingInfo> {
    const ratings: UserContestRankingInfo = {};

    const batches = chunk(usernames, GET_RATINGS_BATCH_SIZE);

    for (const batchOfUsernames of batches) {
      await axios({
        method: "post",
        url: GRAPHQL_URL,
        headers: {
          "content-type": "application/json",
        },
        data: {
          query: createQueryForRatings(batchOfUsernames),
        },
      })
        .then((res) => res.data.data)
        .then((batchOfRatings: RawUserContestRankingInfo) => {
          for (const [username, userContestRanking] of Object.entries(
            batchOfRatings
          )) {
            if (userContestRanking) {
              const rating = Math.round(userContestRanking.rating);
              const badge = userContestRanking.badge?.name || "";

              ratings[username] = {
                rating,
                badge,
              };
            }
          }
        });
    }

    return ratings;
  }

  async getUser(username: string): Promise<RawUserPublicProfile> {
    return axios({
      method: "post",
      url: GRAPHQL_URL,
      headers: {
        "content-type": "application/json",
      },
      data: {
        query: createQueryForUserPublicProfile(username),
      },
    }).then((res) => res.data.data);
  }
}

export const leetCodeService = new LeetCodeService();
