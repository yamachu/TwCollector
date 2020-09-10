import dayjs from "dayjs";
import { google, GoogleApis, sheets_v4 } from "googleapis";
import {
  IFailedEntityStorable,
  IRawEntitiesDumpable,
  ISummaryStorable,
  nopDumpRawEntities,
  nopStoreFailedEntities,
  nopStoreSummaries,
} from ".";
import { StoreSummary, TweetEntity } from "../contract";
const JSONBig: {
  stringify: typeof JSON.stringify;
  parse: typeof JSON.parse;
} = require("json-bigint");

type Credentials = Parameters<
  GoogleApis["auth"]["OAuth2"]["prototype"]["setCredentials"]
>[0];

// ref: https://developers.google.com/sheets/api/quickstart/nodejs
export const init = (
  clientParams: {
    clientId?: string;
    clientSecret?: string;
  },
  credential: Credentials,
  sheetId: string
): ISummaryStorable & IFailedEntityStorable & IRawEntitiesDumpable => {
  if (
    Object.keys(credential).every((k) => {
      const value = (credential as any)[k];
      return value === undefined || value === null;
    }) ||
    Object.keys(clientParams).every((k) => {
      const value = (clientParams as any)[k];
      return value === undefined || value === null;
    })
  ) {
    console.warn(
      "google auth is not completed, if you want to use google apis, you must pass credentials"
    );
    return {
      storeSummaries: nopStoreSummaries,
      storeFailedEntities: nopStoreFailedEntities,
      dumpRawEntities: nopDumpRawEntities,
    };
  }

  if (sheetId === undefined) {
    console.warn("if use spreadsheet object, MUST SET SHEET_ID value to env");
    return {
      storeSummaries: nopStoreSummaries,
      storeFailedEntities: nopStoreFailedEntities,
      dumpRawEntities: nopDumpRawEntities,
    };
  }

  // 本来であればServiceAccountがいいのだろうけど、権限がなぁ
  // ref: https://github.com/googleapis/google-api-nodejs-client#service-account-credentials
  const oauthClient = new google.auth.OAuth2(
    clientParams.clientId,
    clientParams.clientSecret,
    "urn:ietf:wg:oauth:2.0:oob"
  );
  oauthClient.setCredentials(credential);

  const sheets = google.sheets({ version: "v4", auth: oauthClient });
  return {
    storeSummaries: storeSummaries(sheets, sheetId),
    storeFailedEntities: storeJsonStringEntries(sheets, sheetId, "failed"),
    dumpRawEntities: storeJsonStringEntries(sheets, sheetId, "raw"),
  };
};

const storeSummaries = (
  sheetClient: sheets_v4.Sheets,
  sheetId: string,
  pageName: string = "summaries"
) => (summaries: Array<StoreSummary>): Promise<void> => {
  return new Promise((resolve, reject) =>
    sheetClient.spreadsheets.values.append(
      {
        spreadsheetId: sheetId,
        range: pageName,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: summaries
            .map((v) => [
              v.id,
              v.id_str,
              dayjs(v.created_at).toDate(),
              v.user_id,
              v.screen_name,
              v.followers_count,
              v.retweeted_id,
              v.entry,
              v.text,
            ])
            .reverse(),
        },
      },
      (resp) => {
        if (resp !== null) {
          reject(resp);
          return;
        }
        resolve();
      }
    )
  );
};

const storeJsonStringEntries = (
  sheetClient: sheets_v4.Sheets,
  sheetId: string,
  pageName: string
) => (summaries: Array<TweetEntity>): Promise<void> => {
  return new Promise((resolve, reject) =>
    sheetClient.spreadsheets.values.append(
      {
        spreadsheetId: sheetId,
        range: pageName,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: summaries.map((v) => [JSONBig.stringify(v)]).reverse(),
        },
      },
      (resp) => {
        if (resp !== null) {
          reject(resp);
          return;
        }
        resolve();
      }
    )
  );
};
