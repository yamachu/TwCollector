import { Context } from "@azure/functions";
import { init } from "../../..";
import { collectSummaries } from "../../../epic";

module.exports = async function (context: Context) {
  const { twitter, spreadsheet, urlDetectors } = init();
  const since_id = context.bindings.nextSinceId;
  const { next_since_id } = await collectSummaries(
    twitter.fetch,
    spreadsheet.storeSummaries,
    spreadsheet.storeFailedEntities,
    spreadsheet.dumpRawEntities,
    urlDetectors,
    {
      since_id: since_id.replace("n", ""),
    }
  );
  return {
    next_since_id,
  };
};
