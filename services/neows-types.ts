export type NeoWsFeedResponse = {
  near_earth_objects?: Record<string, NeoWsObject[]>;
};

export type NeoWsObject = {
  id?: string;
  name?: string;
  nasa_jpl_url?: string;
  estimated_diameter?: {
    meters?: {
      estimated_diameter_min?: number;
      estimated_diameter_max?: number;
    };
  };
  is_potentially_hazardous_asteroid?: boolean;
  close_approach_data?: Array<{
    close_approach_date?: string;
    close_approach_date_full?: string;
    relative_velocity?: {
      kilometers_per_second?: string;
      kilometers_per_hour?: string;
    };
    miss_distance?: {
      kilometers?: string;
      lunar?: string;
      astronomical?: string;
    };
    orbiting_body?: string;
  }>;
};
