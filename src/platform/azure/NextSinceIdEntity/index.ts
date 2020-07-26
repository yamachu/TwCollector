import * as df from "durable-functions";

module.exports = df.entity(function (context) {
  const maybeSinceId = process.env.DEFAULT_SINCE_ID;
  let currentValue = context.df.getState(() => maybeSinceId ?? "0");

  switch (context.df.operationName) {
    case "set":
      const amount = context.df.getInput();
      currentValue = amount;
      break;
    case "get":
      context.df.return(currentValue);
      break;
  }

  context.df.setState(currentValue);
});
