export type OpenNotifyIssResponse = {
  message?: string;
  timestamp?: number;
  iss_position?: {
    latitude?: string;
    longitude?: string;
  };
};
