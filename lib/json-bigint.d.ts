declare module "json-bigint" {
  export const stringify: typeof JSON.stringify;
  export const parse: typeof JSON.parse;
  interface Options {
    strict?: boolean;
    storeAsString?: boolean;
    alwaysParseAsBig?: boolean;
    useNativeBigInt?: boolean;
    protoAction?: "error" | "ignore" | "preserve";
    constructorAction?: "error" | "ignore" | "preserve";
  }
  export = (option?: Options) => ({
    parse,
    stringify,
  });
}
