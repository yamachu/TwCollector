import Twitter, { AccessTokenOptions } from "twitter";
import { ITweetFetchable, nopFetch } from ".";
import { TweetEntity } from "../contract";
import { lessThanByString } from "../util";

export const init = (
  token: Pick<
    AccessTokenOptions,
    | "access_token_key"
    | "access_token_secret"
    | "consumer_key"
    | "consumer_secret"
  >,
  searchDomain: string
): ITweetFetchable => {
  if (
    [
      token.access_token_key,
      token.access_token_secret,
      token.consumer_key,
      token.consumer_secret,
    ].some((v) => v === undefined)
  ) {
    console.warn(
      "twitter client is not initialized, if you want to fetch tweets via twitter, you must pass credentials"
    );
    return {
      fetch: nopFetch,
    };
  }
  const twitterInstance = new Twitter(token);

  return {
    fetch: fetch(twitterInstance, searchDomain),
  };
};

const fetch = (twitterInstance: Twitter, domain: string) => async (
  since_id?: string
): Promise<Array<TweetEntity>> => {
  const tweets = await twitterInstance.get("search/tweets", {
    q: `url:${domain} include:nativeretweets`,
    count: 100,
    since_id: since_id,
    include_entities: true,
  });

  return (tweets.statuses as Array<TweetEntity>).filter((v) =>
    lessThanByString(since_id ?? "0", v.id_str)
  );
};
