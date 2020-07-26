import dotenv from "dotenv";
import {
  parseEntryFromAnyUrl,
  parseEntryFromBhatena,
  parseEntryFromHtnto,
} from "./domain/parseEntryFromUrl";
import { file, spreadsheet, twitter } from "./infrastructure";

export const init = () => {
  if (process.env.LOCAL) {
    dotenv.config();
  }

  const targetDomain = process.env.TARGET_DOMAIN;
  if (targetDomain === undefined) {
    throw new Error("MUST SET TARGET_DOMAIN value to env");
  }

  return {
    twitter: twitter(
      {
        access_token_key: process.env.ACCESS_TOKEN_KEY!,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET!,
        consumer_key: process.env.CONSUMER_KEY!,
        consumer_secret: process.env.CONSUMER_SECRET!,
      },
      targetDomain
    ),
    file: file(
      process.env.TWEETS_STATUES_FILE,
      process.env.STORE_SUMMARIES_FILE,
      process.env.STORE_FAILED_ENTITIES_FILE,
      process.env.DUMP_RAW_ENTITIES_FILE
    ),
    spreadsheet: spreadsheet(
      {
        clientId: process.env.GOOGLE_GDRIVE_CREDENTIAL_CLIENT_ID,
        clientSecret: process.env.GOOGLE_GDRIVE_CREDENTIAL_CLIENT_SECRET,
      },
      {
        access_token: process.env.GOOGLE_GDRIVE_CREDENTIAL_ACCESS_TOKEN,
        // expiry_date: toIntOrUndefined(
        //   process.env.GOOGLE_GDRIVE_CREDENTIAL_EXPIRY_DATE
        // ),
        refresh_token: process.env.GOOGLE_GDRIVE_CREDENTIAL_REFRESH_TOKEN,
        token_type: process.env.GOOGLE_GDRIVE_CREDENTIAL_TOKEN_TYPE,
      },
      process.env.SHEET_ID!
    ),
    urlDetectors: [
      parseEntryFromBhatena,
      parseEntryFromHtnto,
      parseEntryFromAnyUrl(targetDomain),
    ],
  };
};

// const toIntOrUndefined = (v: string | undefined) => {
//   const parsed = Number.parseInt(v ?? "", 10);
//   if (Number.isNaN(parsed)) {
//     return undefined;
//   }
//   return parsed;
// };
