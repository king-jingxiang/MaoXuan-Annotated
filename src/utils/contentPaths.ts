import type { TimelineEntry } from "@/types/timeline";

const CDN_BASE = "https://pub-2c40327cb94b4694af27f7abc5adcb5e.r2.dev/maoxuan/";
const CONTENT_BASE = import.meta.env.VITE_CONTENT_BASE ?? import.meta.env.BASE_URL;

export function getArticleFileBase(relPath: string) {
  const last = relPath.split("/").pop() || relPath;
  return last.replace(/\.md$/i, "");
}

export function getOriginalMdUrl(entry: TimelineEntry) {
  return `${CONTENT_BASE}content/毛泽东选集/${entry.relPath}`;
}

export function getInterpretationMdUrl(entry: TimelineEntry) {
  return `${CONTENT_BASE}content/毛泽东选集_解读/${entry.relPath}`;
}

export function getTimelineUrl() {
  return `${CONTENT_BASE}timeline.md`;
}

export function getAudioUrl(entry: TimelineEntry) {
  return `${CDN_BASE}audio/${entry.relPath.replace(/\.md$/i, ".mp3")}`;
}

export function getInfoImageUrl(entry: TimelineEntry) {
  const fileBase = getArticleFileBase(entry.relPath);
  return `${CDN_BASE}images/信息图/${entry.volume}/${fileBase}.jpeg`;
}

export function getDiagramImageUrl(entry: TimelineEntry) {
  const fileBase = getArticleFileBase(entry.relPath);
  return `${CDN_BASE}images/图解/${entry.volume}/${fileBase}.jpeg`;
}
