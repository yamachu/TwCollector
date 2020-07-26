const path = require("path");

const getBuildTargets = (target) => {
  const platform = {
    local: [["main", path.resolve(__dirname, "./src/platform/local/index.ts")]],
    azure: [
      [
        "DurableFunctionsMainActivity",
        path.resolve(
          __dirname,
          "./src/platform/azure/DurableFunctionsMainActivity/index.ts"
        ),
      ],
      [
        "DurableFunctionsHttpStart",
        path.resolve(
          __dirname,
          "./src/platform/azure/DurableFunctionsHttpStart/index.ts"
        ),
      ],
      [
        "DurableFunctionsOrchestrator",
        path.resolve(
          __dirname,
          "./src/platform/azure/DurableFunctionsOrchestrator/index.ts"
        ),
      ],
      [
        "NextSinceIdEntity",
        path.resolve(
          __dirname,
          "./src/platform/azure/NextSinceIdEntity/index.ts"
        ),
      ],
    ],
  };
  switch (target) {
    case "local":
      return platform.local.map((v) => ["local", ...v]);
    case "azure":
      return platform.azure.map((v) => ["azure", ...v]);
    case "all":
      return [
        ...platform.local.map((v) => ["local", ...v]),
        ...platform.azure.map((v) => ["azure", ...v]),
      ];
    default:
      throw new Error("must set build target");
  }
};

const platformSpecifiedConfig = (platform) => {
  switch (platform) {
    case "local":
      return {};
    case "azure":
      return {
        output: {
          libraryTarget: "commonjs2",
        },
        externals: {
          // 全てのpackageで使うからAzure側で展開する
          "durable-functions": "durable-functions",
        },
      };
    default:
      return {};
  }
};

module.exports = (env, argv) => {
  const entries = getBuildTargets(process.env.BUILD_TARGET || "local");

  return entries.map(([platform, name, entry]) => {
    const { output, resolve, module, ...rest } = platformSpecifiedConfig(
      platform
    );
    return {
      target: "node",
      entry: entry,
      output: {
        path: path.resolve(__dirname, platform, name),
        filename: "index.js",
        libraryTarget: "commonjs",
        ...output,
      },
      resolve: {
        extensions: [".ts", ".js"],
        modules: ["node_modules"],
        ...resolve,
      },
      module: {
        rules: [
          {
            test: /\.ts$/,
            exclude: /node_modules/,
            use: ["ts-loader"],
          },
        ],
        ...module,
      },
      ...rest,
    };
  });
};
