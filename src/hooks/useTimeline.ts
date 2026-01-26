import { useEffect, useMemo, useState } from "react";
import type { TimelineData } from "@/types/timeline";
import { parseTimelineMarkdown } from "@/utils/timelineParser";

let timelinePromise: Promise<TimelineData> | null = null;

async function loadTimeline(): Promise<TimelineData> {
  if (!timelinePromise) {
    timelinePromise = fetch(`${import.meta.env.BASE_URL}timeline.md`, { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error("无法加载时间线");
        return r.text();
      })
      .then((text) => parseTimelineMarkdown(text));
  }
  return timelinePromise;
}

export function useTimeline() {
  const [data, setData] = useState<TimelineData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadTimeline()
      .then((d) => {
        if (cancelled) return;
        setData(d);
        setError(null);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "无法加载时间线");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(
    () => ({
      data,
      error,
      loading,
    }),
    [data, error, loading]
  );
}
