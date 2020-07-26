import dayjs from "dayjs";
import * as df from "durable-functions";

module.exports = df.orchestrator(function* (context) {
  const entityId = new df.EntityId("NextSinceIdEntity", "sinceIdCounter");
  const currentValue = yield context.df.callEntity(entityId, "get");
  context.log(`entity(${entityId}) returns: ${currentValue}`);

  const result: {
    next_since_id: string;
  } = yield context.df.callActivity(
    "DurableFunctionsMainActivity",
    currentValue.toString()
  );
  yield context.df.callEntity(entityId, "set", result.next_since_id.toString());
  context.log(
    `current_since_id: ${currentValue}, next_since_id: ${result.next_since_id}`
  );

  const currentDateTime = dayjs(context.df.currentUtcDateTime).toDate();
  const nextCleanupDateTime = dayjs(currentDateTime).add(5, "m").toDate();
  context.log(`current: ${currentDateTime}, next: ${nextCleanupDateTime}`);

  yield context.df.createTimer(nextCleanupDateTime);

  // ref: https://github.com/Azure/azure-functions-durable-js/issues/126
  // とりあえず return する
  yield context.df.continueAsNew(undefined);
  return "";
});
