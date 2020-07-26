import { init } from "../..";
import { collectSummaries } from "../../epic";

const main = async (since_id?: string) => {
  const { file, spreadsheet, urlDetectors } = init();
  const result = await collectSummaries(
    file.fetch,
    spreadsheet.storeSummaries,
    spreadsheet.storeFailedEntities,
    spreadsheet.dumpRawEntities,
    urlDetectors,
    {
      since_id,
    }
  );
  console.log(`next_since_id: ${result.next_since_id}`);
};

main();
