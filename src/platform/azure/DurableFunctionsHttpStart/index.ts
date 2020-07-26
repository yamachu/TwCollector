import { Context, HttpRequest } from "@azure/functions";
// default exportしているのがないので * で引っ張る
import * as df from "durable-functions";

module.exports = async function (context: Context, req: HttpRequest) {
  const client = df.getClient(context);
  const instanceId = "infiniteLoopOrchestrator";
  await client.startNew("DurableFunctionsOrchestrator", instanceId, req.body);

  context.log(`Started orchestration with ID = '${instanceId}'.`);

  return client.createCheckStatusResponse(context.bindingData.req, instanceId);
};
