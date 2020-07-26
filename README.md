## これ何

ブログとかドメイン単位でのエゴサを Twitter でやって、結果を収集するやつ

### Note

* SpreadSheetへのAccessTokenとかを取得するまでの流れ
  1. 適当にプロジェクト作る
  2. OAuthで認証みたいに設定
  3. clientId, clientSecretKeyをメモ
  4. https://qiita.com/shin1ogawa/items/49a076f62e5f17f18fe5 を参考にcurlでシュッと取得する
    - spreadsheetを操作するためのscopeは "https://www.googleapis.com/auth/spreadsheets"

* 他のCloudへの移植
  - src/infrastructure 以下をいい感じに書いて src/infrastructure/index.ts に書かれている interface を実装していく形
  - Azure Functions の durable functions のモニターパターン (ref: https://docs.microsoft.com/ja-jp/azure/azure-functions/durable/durable-functions-monitor?tabs=javascript ) みたいなものを実装するのを目指す形が良さそう
    - CloudScheduler で cron 式を毎回書き換えて next_since_id パラメータを渡す方式
    - CloudWatch で 〃
  - 使いたい infrastructure を実装したら platform に実行環境特有の I/O などのロジックを実装し、エントリポイントとして利用する
