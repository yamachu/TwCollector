import test from "ava";
import { trimBeginZeros, lessThanByString } from "./util";

test("与えた文字列の先頭の0を除いた文字列を返す", (t) => {
  t.deepEqual(trimBeginZeros("00500"), "500");
  t.deepEqual(trimBeginZeros("abc"), "abc");
});

test("文字列で数字を比較できる", (t) => {
  t.false(lessThanByString("01234", "123"));
  t.false(lessThanByString("123", "123"));
  t.true(lessThanByString("123456789012345", "123456789012346"));
  t.true(lessThanByString("12345678901234", "123456789012346"));
});
