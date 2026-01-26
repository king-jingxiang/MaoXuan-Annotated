export type TimelineEntry = {
  id: string;
  date: string;
  year: string;
  relPath: string;
  title: string;
  volume: string;
};

export type TimelineData = {
  entries: TimelineEntry[];
  byId: Record<string, TimelineEntry>;
};
