import nodeFetch from "node-fetch";

export type IParseEntryFromUrl = (url: string) => Promise<string | null>;

export const parseEntryFromAnyUrl = (
  targetDomain: string
): IParseEntryFromUrl => (url: string) => {
  const re = new RegExp(/^https:?\/\/(.+?)\/.*$/);
  const matches = url.match(re);
  if (matches === null) {
    return Promise.resolve(null);
  }
  const match = matches[1];
  if (match === targetDomain) {
    return Promise.resolve(url);
  }
  return Promise.resolve(null);
};

export const parseEntryFromBhatena: IParseEntryFromUrl = (url: string) =>
  parseEntryFromBhatenaWithParam(url).then((v) => {
    if (v === null) {
      return parseEntryFromBhatenaWithRedirect(url);
    }
    return v;
  });

const parseEntryFromBhatenaWithParam: IParseEntryFromUrl = (url: string) => {
  // 最小マッチにしたいので、`.+?` にしてる
  const re = new RegExp(/^.*\?url=(.+?)\&.+$/);
  const matches = url.match(re);
  if (matches === null) {
    return Promise.resolve(null);
  }
  const match = matches[1];
  return Promise.resolve(decodeURIComponent(match));
};

const parseEntryFromBhatenaWithRedirect = async (url: string) =>
  nodeFetch(url, {
    method: "HEAD",
    redirect: "manual",
  }).then((v) => {
    return v.headers.get("location");
  });

export const parseEntryFromHtnto: IParseEntryFromUrl = async (url: string) => {
  return nodeFetch(url, {
    method: "HEAD",
  })
    .then((v) => {
      return v.headers.get("x-redirect-to");
    })
    .then((redirectUrl) => {
      if (redirectUrl === null) {
        return null;
      }
      return parseEntryFromBhatenaWithRedirect(redirectUrl);
    });
};
