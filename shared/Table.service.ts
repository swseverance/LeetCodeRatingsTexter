import { TableClient, AzureNamedKeyCredential } from "@azure/data-tables";

const accountName = process.env["STORAGE_ACCOUNT_NAME"]!;
const accountKey = process.env["STORAGE_ACCOUNT_KEY"]!;
const tableName = process.env["STORAGE_TABLE_NAME"]!;
const url = process.env["STORAGE_TABLE_URL"]!;
const credential = new AzureNamedKeyCredential(accountName, accountKey);

export const tableService = new TableClient(url, tableName, credential);
