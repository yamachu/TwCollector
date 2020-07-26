import { SettledPromiseValue } from "./contract";

export const likePromiseAllSettled = async <T, U>(
  v: Array<Promise<SettledPromiseValue<T, U>>>
) => {
  return Promise.all(v).then((entities) =>
    entities.reduce(
      (prev, curr) => {
        if (curr.status === "fulfilled") {
          return {
            ...prev,
            succeeded: [...prev.succeeded, curr.value],
          };
        }
        return {
          ...prev,
          failed: [...prev.failed, curr.value],
        };
      },
      { succeeded: [] as Array<T>, failed: [] as Array<U> }
    )
  );
};

export const trimBeginZeros = (v: string): string => {
  return v.toString().replace(/^0*/, "");
};

const compareCharNumber = (
  maybeLess: string,
  maybeMore: string,
  beginDeg: number
): boolean => {
  const firstLess = maybeLess.slice(beginDeg, beginDeg + 1);
  const firstMore = maybeMore.slice(beginDeg, beginDeg + 1);

  if (firstLess === "" || firstMore === "") {
    return false;
  }

  if (Number.parseInt(firstLess, 10) === Number.parseInt(firstMore, 10)) {
    return compareCharNumber(maybeLess, maybeMore, beginDeg + 1);
  }

  return Number.parseInt(firstLess, 10) < Number.parseInt(firstMore, 10);
};

export const lessThanByString = (
  maybeLess: string,
  maybeMore: string
): boolean => {
  const trimmedMaybeLess = trimBeginZeros(maybeLess);
  const trimmedMaybeMore = trimBeginZeros(maybeMore);

  if (trimmedMaybeLess.length < trimmedMaybeMore.length) {
    return true;
  }
  if (trimmedMaybeLess.length > trimmedMaybeMore.length) {
    return false;
  }

  return compareCharNumber(trimmedMaybeLess, trimmedMaybeMore, 0);
};
