export type UsnoMoonPhenomenon = {
  phen?: string | null;
  time?: string | null;
};

export type UsnoPhaseItem = {
  phase?: string | null;
  year?: number | null;
  month?: number | null;
  day?: number | null;
  time?: string | null;
};

export type UsnoOneDayResponse = {
  properties?: {
    data?: {
      closestphase?: UsnoPhaseItem | null;
      curphase?: string | null;
      fracillum?: string | number | null;
      moondata?: UsnoMoonPhenomenon[] | null;
    } | null;
  } | null;
};

export type UsnoMoonPhasesResponse = {
  phasedata?: UsnoPhaseItem[] | null;
};
