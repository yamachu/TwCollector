import { StoreSummary, TweetEntity } from "../contract";

export { init as file } from "./file";
export { init as spreadsheet } from "./spreadsheet";
export { init as twitter } from "./twitter";

export interface ITweetFetchable {
  fetch: (since_id?: string) => Promise<Array<TweetEntity>>;
}

export interface ISummaryStorable {
  storeSummaries: (summaries: Array<StoreSummary>) => Promise<void>;
}

export interface IFailedEntityStorable {
  storeFailedEntities: (entities: Array<TweetEntity>) => Promise<void>;
}

export interface IRawEntitiesDumpable {
  dumpRawEntities: (entities: Array<TweetEntity>) => Promise<void>;
}

export const nopFetch: ITweetFetchable["fetch"] = (_since_id?: string) => {
  return Promise.resolve([]);
};

export const nopStoreSummaries: ISummaryStorable["storeSummaries"] = (_) => {
  return Promise.resolve();
};

export const nopStoreFailedEntities: IFailedEntityStorable["storeFailedEntities"] = (
  _
) => {
  return Promise.resolve();
};

export const nopDumpRawEntities: IRawEntitiesDumpable["dumpRawEntities"] = (
  _
) => {
  return Promise.resolve();
};
