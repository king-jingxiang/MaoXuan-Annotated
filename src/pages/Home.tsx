import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useTimeline } from "@/hooks/useTimeline";
import { cn } from "@/lib/utils";
import type { TimelineEntry } from "@/types/timeline";

function groupByYear(entries: TimelineEntry[]) {
  const map: Record<string, TimelineEntry[]> = {};
  for (const e of entries) {
    (map[e.year] ||= []).push(e);
  }
  const years = Object.keys(map).sort((a, b) => Number(a) - Number(b));
  return { map, years };
}

export default function Home() {
  const { data, loading, error } = useTimeline();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const entries = data?.entries || [];
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => e.title.toLowerCase().includes(q) || e.relPath.toLowerCase().includes(q));
  }, [data, query]);

  const grouped = useMemo(() => groupByYear(filtered), [filtered]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-zinc-100">时间线目录（按年分组）</h1>
            <p className="mt-1 text-sm text-zinc-400">点击条目进入文章详情，查看信息图、图解、音频与解读。</p>
          </div>

          <div className="w-full sm:max-w-sm">
            <label className="sr-only" htmlFor="q">
              搜索
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
              <Search className="h-4 w-4 text-zinc-400" />
              <input
                id="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索标题 / 路径"
                className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
              />
            </div>
            <div className="mt-1 text-xs text-zinc-500">{filtered.length} 篇</div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="space-y-3">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-white/5" />
          <div className="h-24 animate-pulse rounded-xl bg-white/5" />
          <div className="h-24 animate-pulse rounded-xl bg-white/5" />
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>
      ) : null}

      {!loading && !error ? (
        <div className="space-y-6">
          {grouped.years.map((year) => {
            const items = grouped.map[year] || [];
            return (
              <section key={year} className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-sm font-semibold text-zinc-200">{year}</h2>
                  <span className="text-xs text-zinc-500">{items.length} 篇</span>
                </div>
                <div className="overflow-hidden rounded-xl border border-white/10">
                  <ul className="divide-y divide-white/10">
                    {items.map((e) => (
                      <li key={e.id}>
                        <Link
                          to={`/article/${e.id}`}
                          className={cn(
                            "block px-4 py-3 transition",
                            "bg-white/[0.02] hover:bg-white/[0.05]"
                          )}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-medium text-zinc-100">{e.title}</div>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                                <span>{e.date}</span>
                                <span className="text-white/10">•</span>
                                <span className="truncate">{e.relPath}</span>
                              </div>
                            </div>
                            <div className="shrink-0 rounded-lg bg-black/30 px-2 py-1 text-xs text-zinc-300 ring-1 ring-white/10">
                              打开
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
