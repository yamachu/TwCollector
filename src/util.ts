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

export const asNumberComparable = (base: string) => {
  const trimmedBase = trimBeginZeros(base.toString());

  return {
    lt: (compareValue: string) =>
      asNumberComparableImpl(trimmedBase, compareValue, "lt"),
    gt: (compareValue: string) =>
      asNumberComparableImpl(trimmedBase, compareValue, "gt"),
    ge: (compareValue: string) =>
      asNumberComparableImpl(trimmedBase, compareValue, "ge"),
    le: (compareValue: string) =>
      asNumberComparableImpl(trimmedBase, compareValue, "le"),
  };
};

const compareCharNumber = (
  base: string,
  compareValue: string,
  beginDeg: number,
  op: "lt" | "gt" | "ge" | "le"
): boolean => {
  const firstBase = base.toString().slice(beginDeg, beginDeg + 1);
  const firstCompareValue = compareValue
    .toString()
    .slice(beginDeg, beginDeg + 1);

  if (
    firstBase === "" &&
    firstCompareValue === "" &&
    (op === "ge" || op === "le")
  ) {
    return true;
  }

  if (firstBase === "" || firstCompareValue === "") {
    // 最初から空文字列が渡されたときとか、最後の文字まで見ても同じ値だった場合
    return false;
  }

  if (
    Number.parseInt(firstBase, 10) === Number.parseInt(firstCompareValue, 10)
  ) {
    return compareCharNumber(base, compareValue, beginDeg + 1, op);
  }

  switch (op) {
    case "lt":
      return (
        Number.parseInt(firstBase, 10) < Number.parseInt(firstCompareValue, 10)
      );
    case "gt":
      return (
        Number.parseInt(firstBase, 10) > Number.parseInt(firstCompareValue, 10)
      );
    case "le":
      return (
        Number.parseInt(firstBase, 10) <= Number.parseInt(firstCompareValue, 10)
      );
    case "ge":
      return (
        Number.parseInt(firstBase, 10) >= Number.parseInt(firstCompareValue, 10)
      );
    default:
      throw new Error(`invalid op: ${op}`);
  }
};

const asNumberComparableImpl = (
  trimmedBase: string,
  compareValue: string,
  op: "lt" | "gt" | "ge" | "le"
): boolean => {
  const trimmedCompareValue = trimBeginZeros(compareValue);

  if (trimmedBase.length < trimmedCompareValue.length) {
    return op === "le" || op === "lt";
  }
  if (trimmedBase.length > trimmedCompareValue.length) {
    return op === "ge" || op === "gt";
  }

  return compareCharNumber(trimmedBase, trimmedCompareValue, 0, op);
};
