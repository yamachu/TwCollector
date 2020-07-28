import { readFile, writeFile } from "fs";
import {
  IFailedEntityStorable,
  IRawEntitiesDumpable,
  ISummaryStorable,
  ITweetFetchable,
  nopDumpRawEntities,
  nopFetch,
  nopStoreFailedEntities,
  nopStoreSummaries,
} from ".";
import { StoreSummary, TweetEntity } from "../contract";
import { asNumberComparable } from "../util";

export const init = (
  readTweetFile?: string,
  writeSummaryFile?: string,
  writeFailedFile?: string,
  writeRawFile?: string
): ITweetFetchable &
  ISummaryStorable &
  IFailedEntityStorable &
  IRawEntitiesDumpable => {
  return {
    fetch: readTweetFile === undefined ? nopFetch : fetch(readTweetFile),
    storeSummaries:
      writeSummaryFile === undefined
        ? nopStoreSummaries
        : storeSummaries(writeSummaryFile),
    storeFailedEntities:
      writeFailedFile === undefined
        ? nopStoreFailedEntities
        : storeJsonStringEntries(writeFailedFile),
    dumpRawEntities:
      writeRawFile === undefined
        ? nopDumpRawEntities
        : storeJsonStringEntries(writeRawFile),
  };
};

// for development or migration
const fetch = (fileName: string) => async (
  since_id?: string
): Promise<Array<TweetEntity>> => {
  return new Promise((resolve, reject) => {
    readFile(fileName, { encoding: "utf-8" }, (err, data) => {
      if (err != null) {
        reject(err);
        return;
      }
      try {
        const json: Array<TweetEntity> = JSON.parse(data);
        const lessThanCompare = asNumberComparable(since_id ?? "0").lt;
        resolve(json.filter((entity) => lessThanCompare(entity.id_str)));
      } catch (e) {
        reject(e);
      }
    });
  });
};

const summaryToCsv = (summary: StoreSummary, delimiter: string = ",") => {
  const escape = (v: string) =>
    [
      (s: string) => s.replace(/"/g, '"'),
      (s: string) => s.replace(/\r/g, "\\r"),
      (s: string) => s.replace(/\n/g, "\\n"),
    ].reduce((prev, curr) => curr(prev), v);

  return (Object.keys(summary) as (keyof StoreSummary)[])
    .reduce((prev, curr) => {
      const value = summary[curr];
      if (typeof value === "string") {
        return [...prev, `"${escape(value)}"`];
      }
      return [...prev, value];
    }, [] as any[])
    .join(delimiter);
};

const storeSummaries = (fileName: string) => async (
  summaries: Array<StoreSummary>
): Promise<void> => {
  return new Promise((resolve, reject) => {
    writeFile(
      fileName,
      summaries.map((l) => summaryToCsv(l)).join("\n"),
      {
        encoding: "utf-8",
        flag: "a",
      },
      (err) => {
        if (err !== null) {
          reject(err);
        }
        resolve();
      }
    );
  });
};

const storeJsonStringEntries = (fileName: string) => async (
  entities: Array<TweetEntity>
): Promise<void> => {
  return new Promise((resolve, reject) => {
    writeFile(
      fileName,
      entities.map((e) => JSON.stringify(e)).join("\n"),
      {
        encoding: "utf-8",
        flag: "a",
      },
      (err) => {
        if (err !== null) {
          reject(err);
        }
        resolve();
      }
    );
  });
};
