type SpaceDevsImage = {
  image_url?: string | null;
  thumbnail_url?: string | null;
};

type SpaceDevsNamedType = {
  name?: string | null;
  abbrev?: string | null;
};

type SpaceDevsUrl = {
  url?: string | null;
};

export type SpaceDevsLaunch = {
  id?: string | null;
  url?: string | null;
  name?: string | null;
  slug?: string | null;
  status?: SpaceDevsNamedType | null;
  net?: string | null;
  window_start?: string | null;
  window_end?: string | null;
  launch_service_provider?: {
    name?: string | null;
  } | null;
  mission?: {
    name?: string | null;
    description?: string | null;
    type?: string | null;
    info_urls?: SpaceDevsUrl[] | null;
    vid_urls?: SpaceDevsUrl[] | null;
  } | null;
  rocket?: {
    configuration?: {
      full_name?: string | null;
    } | null;
  } | null;
  pad?: {
    name?: string | null;
    location?: {
      name?: string | null;
    } | null;
  } | null;
  image?: SpaceDevsImage | null;
  webcast_live?: boolean | null;
  vid_urls?: SpaceDevsUrl[] | null;
  info_urls?: SpaceDevsUrl[] | null;
};

export type SpaceDevsEvent = {
  id?: number | string | null;
  url?: string | null;
  name?: string | null;
  slug?: string | null;
  date?: string | null;
  type?: {
    name?: string | null;
  } | null;
  description?: string | null;
  location?: string | null;
  image?: SpaceDevsImage | null;
  info_urls?: SpaceDevsUrl[] | null;
  vid_urls?: SpaceDevsUrl[] | null;
  webcast_live?: boolean | null;
  program?: Array<{
    name?: string | null;
  }> | null;
};

export type SpaceDevsListResponse<T> = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: T[];
};
