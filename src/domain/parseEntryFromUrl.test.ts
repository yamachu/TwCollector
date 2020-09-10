import test from "ava";
import {
  parseEntryFromAnyUrl,
  parseEntryFromBhatena,
  parseEntryFromHtnto,
} from "./parseEntryFromUrl";

test.cb("b.hatena.ne.jpのentitiesのurlをparse出来る", (t) => {
  parseEntryFromBhatena(
    "https://b.hatena.ne.jp/entry?url=https%3A%2F%2Fteitoku-window.hatenablog.com%2Fentry%2F2020%2F04%2F13%2F220854&utm_campaign=bookmark_share&utm_content=teitoku-window.hatenablog.com&utm_medium=social&utm_source=twitter"
  ).then((actual) => {
    t.deepEqual(
      actual,
      "https://teitoku-window.hatenablog.com/entry/2020/04/13/220854"
    );
    t.end();
  });
});

// 流入のcounterがincrementされてしまうのでskip
test.cb.skip("htn.toのentitiesのurlをparse出来る", (t) => {
  parseEntryFromHtnto("https://htn.to/XkwKwoiyFE").then((actual) => {
    t.deepEqual(
      actual,
      "https://teitoku-window.hatenablog.com/entry/2020/04/13/220854"
    );
    t.end();
  });
});

test.cb("対象のドメインのURLをparse出来る", (t) => {
  parseEntryFromAnyUrl("teitoku-window.hatenablog.com")(
    "https://teitoku-window.hatenablog.com/entry/2020/04/13/220854"
  )
    .then((successActual) => {
      t.deepEqual(
        successActual,
        "https://teitoku-window.hatenablog.com/entry/2020/04/13/220854"
      );
      return parseEntryFromAnyUrl("teitoku-window.hatenablog.com")(
        "https://tttteitoku-window.hatenablog.com/entry/2020/04/13/220854"
      );
    })
    .then((failedActual) => {
      t.deepEqual(failedActual, null);
      t.end();
    });
});

test.cb("長いツイートで展開しないといけないURLも展開できる", (t) => {
  parseEntryFromAnyUrl("teitoku-window.hatenablog.com")(
    "https://twitter.com/i/web/status/1304065139507781633"
  ).then((actual) => {
    t.deepEqual(
      actual,
      "https://teitoku-window.hatenablog.com/entry/2020/07/28/230235"
    );
    t.end();
  });
});
