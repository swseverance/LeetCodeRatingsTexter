const axios = require("axios");
const { chunk } = require("lodash");

const GET_RATINGS_BATCH_SIZE = process.env["GET_RATINGS_BATCH_SIZE"];
const GRAPHQL_URL = process.env["GRAPHQL_URL"];

const createQueryForRatings = (usernames) => {
  const createQueryForUsername = (username) => `
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

const createQueryForUserPublicProfile = (username) => `
  query userPublicProfile {
    matchedUser(username: "${username}") {
      username
    }
  }
`;

class LeetCodeService {
  /**
   * sample response:
   *
   * {
   *   userwithbadge: {
   *     rating: 1950.4900046430503,
   *     badge: 'Knight'
   *   }
   *   userwithoutbadge: {
   *     rating: 1631.4324539546762,
   *     badge: ''
   *   }
   * }
   */
  async getRatings(usernames) {
    const ratings = {};

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
        .then((batchOfRatings) => {
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

  /**
   * sample response when user exists:
   *
   * {
   *   matchedUser: {
   *     username: 'swseverance'
   *   }
   * }
   *
   * sample response when user does not exist:
   *
   * {
   *   matchedUser: null
   * }
   */
  getUser(username) {
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

module.exports = new LeetCodeService();
