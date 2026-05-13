export type JplCadResponse = {
  signature?: {
    version?: string;
    source?: string;
  };
  count?: number | string;
  total?: number | string;
  fields?: string[];
  data?: string[][];
};
