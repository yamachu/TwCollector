import test from "ava";
import { asNumberComparable, trimBeginZeros } from "./util";

test("与えた文字列の先頭の0を除いた文字列を返す", (t) => {
  t.deepEqual(trimBeginZeros("00500"), "500");
  t.deepEqual(trimBeginZeros("abc"), "abc");
});

test("文字列で数字を比較できる", (t) => {
  t.false(asNumberComparable("01234").lt("123"));
  t.false(asNumberComparable("123").lt("123"));
  t.true(asNumberComparable("123456789012345").lt("123456789012346"));
  t.true(asNumberComparable("12345678901234").lt("123456789012346"));

  // Todo: 他の演算子のやつもtest
});
