import type { TimelineData, TimelineEntry } from "@/types/timeline";

function safeDecodeURIComponent(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function encodeArticleId(relPath: string) {
  return encodeURIComponent(relPath);
}

export function decodeArticleId(id: string) {
  return safeDecodeURIComponent(id);
}

export function parseTimelineMarkdown(markdown: string): TimelineData {
  const entries: TimelineEntry[] = [];
  const lines = markdown.split(/\r?\n/);
  // Match lines like: - [YYYY-MM-DD]:[Title] or - [YYYY-MM-DD]:[Title](Link)
  const re = /^\s*-\s*\[(\d{4}-\d{2}-\d{2})\]:\[(.+?)\](?:\(.*\))?\s*$/;

  for (const line of lines) {
    const m = line.match(re);
    if (!m) continue;
    const date = m[1];
    const relPath = m[2];
    const year = date.slice(0, 4);
    const title = (relPath.split("/").pop() || relPath).replace(/\.md$/i, "");
    const volume = relPath.split("/")[0] || "";
    const id = encodeArticleId(relPath);
    entries.push({ id, date, year, relPath, title, volume });
  }

  entries.sort((a, b) => a.date.localeCompare(b.date));
  const byId: Record<string, TimelineEntry> = {};
  for (const e of entries) byId[e.id] = e;
  return { entries, byId };
}
