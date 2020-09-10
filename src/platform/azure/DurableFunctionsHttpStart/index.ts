import { Context, HttpRequest } from "@azure/functions";
// default exportしているのがないので * で引っ張る
import * as df from "durable-functions";

module.exports = async function (context: Context, req: HttpRequest) {
  const client = df.getClient(context);
  const instanceId = "infiniteLoopOrchestrator";
  const since_id = req.query.tweet_since_id ?? process.env.DEFAULT_SINCE_ID;
  await client.startNew("DurableFunctionsOrchestrator", instanceId, {
    since_id,
  });

  context.log(`Started orchestration with ID = '${instanceId}'.`);

  return client.createCheckStatusResponse(context.bindingData.req, instanceId);
};
