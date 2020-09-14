import dayjs from "dayjs";
import * as df from "durable-functions";

module.exports = df.orchestrator(function* (context) {
  const currentValue: string = context.bindingData.input.since_id;
  let mutable_next_since_id = currentValue;

  try {
    const {
      next_since_id,
    }: { next_since_id: string } = yield context.df.callActivity(
      "DurableFunctionsMainActivity",
      (currentValue ?? "") + "n" // 数値として扱われていそうなので、文字列に強制的にキャスト
    );
    context.log(
      `current_since_id: ${currentValue}, next_since_id: ${next_since_id}`
    );
    mutable_next_since_id = next_since_id;
  } catch (e) {
    context.log(e);
  }

  const currentDateTime = dayjs(context.df.currentUtcDateTime).toDate();
  const nextCleanupDateTime = dayjs(currentDateTime).add(5, "m").toDate();
  context.log(`current: ${currentDateTime}, next: ${nextCleanupDateTime}`);

  yield context.df.createTimer(nextCleanupDateTime);

  // ref: https://github.com/Azure/azure-functions-durable-js/issues/126
  // とりあえず return する
  yield context.df.continueAsNew({
    since_id: mutable_next_since_id,
  });
  return "";
});
