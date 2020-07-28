import { convertToTweetToSummary } from "./domain/convertTweetToSummary";
import { IParseEntryFromUrl } from "./domain/parseEntryFromUrl";
import {
  IFailedEntityStorable,
  IRawEntitiesDumpable,
  ISummaryStorable,
  ITweetFetchable,
} from "./infrastructure";
import { asNumberComparable, likePromiseAllSettled } from "./util";

export const collectSummaries = async (
  fetch: ITweetFetchable["fetch"],
  storeSummaries: ISummaryStorable["storeSummaries"],
  storeFailedEntities: IFailedEntityStorable["storeFailedEntities"],
  dumpRawEntities: IRawEntitiesDumpable["dumpRawEntities"],
  urlDetectors: Array<IParseEntryFromUrl>,
  params: {
    since_id?: string;
  }
) => {
  const tweetEntities = await fetch(params.since_id);
  const maxTweetId = tweetEntities
    .map((v) => v.id_str)
    .reduce(
      (prev, curr) => (asNumberComparable(prev).lt(curr) ? curr : prev),
      params.since_id ?? "0"
    );
  const fn = convertToTweetToSummary(urlDetectors);
  const eitherSummaryOrEntity = await likePromiseAllSettled(
    tweetEntities.map((e) => fn(e))
  );

  await storeSummaries(eitherSummaryOrEntity.succeeded);
  await storeFailedEntities(eitherSummaryOrEntity.failed);
  await dumpRawEntities(tweetEntities);

  return {
    next_since_id: maxTweetId,
  };
};
