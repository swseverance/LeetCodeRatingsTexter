const leetCodeService = require("./LeetCode.service");
const tableService = require("./Table.service");
const utils = require("./utils");

module.exports = {
  leetCodeService,
  tableService,
  ...utils,
};
