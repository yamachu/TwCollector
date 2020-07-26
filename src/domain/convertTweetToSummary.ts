import { SettledPromiseValue, StoreSummary, TweetEntity } from "../contract";
import { IParseEntryFromUrl } from "./parseEntryFromUrl";

export const convertToTweetToSummary = (
  urlDetectors: Array<IParseEntryFromUrl>
) => async (
  entity: TweetEntity
): Promise<SettledPromiseValue<StoreSummary, TweetEntity>> => {
  const retweetedEntities =
    entity.retweeted_status?.entities.urls.map((v) => v.expanded_url) ?? [];
  const tweetEntities = entity.entities.urls.map((v) => v.expanded_url);
  const urls = [...retweetedEntities, ...tweetEntities];

  const entryUrl = await Promise.all(
    urls.reduce(
      (prev, curr) => [...prev, ...urlDetectors.map((fn) => fn(curr))],
      [] as Array<Promise<string | null>>
    )
  )
    .then((v) => v.filter((u): u is string => u !== null))
    .then((v) => new Set(v));

  if (entryUrl.size === 0) {
    console.error(`could not detect entry url: ${JSON.stringify(entity)}`);
    return Promise.resolve({
      status: "rejected",
      value: entity,
    });
  }
  if (entryUrl.size > 1) {
    console.warn(`multiple entry url detected: ${JSON.stringify(entity)}`);
  }

  return Promise.resolve({
    status: "fulfilled",
    value: {
      id: entity.id,
      id_str: entity.id_str,
      created_at: entity.created_at,
      user_id: entity.user.id,
      screen_name: entity.user.screen_name,
      text: entity.text,
      followers_count: entity.user.followers_count,
      retweeted_id: entity.retweeted_status?.id ?? "",
      entry: [...entryUrl.keys()][0],
    },
  });
};
