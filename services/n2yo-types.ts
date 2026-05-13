export type N2yoVisualPassResponse = {
  info?: {
    satid?: number;
    satname?: string;
    transactionscount?: number;
    passescount?: number;
  };
  passes?: N2yoVisualPass[];
  error?: string;
};

export type N2yoVisualPass = {
  startUTC?: number;
  maxUTC?: number;
  endUTC?: number;
  duration?: number;
  maxEl?: number;
  startAz?: number;
  startAzCompass?: string;
  endAz?: number;
  endAzCompass?: string;
  mag?: number;
};
