import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import ArticleNav from "@/components/ArticleNav";
import MarkdownView from "@/components/MarkdownView";
import { useTimeline } from "@/hooks/useTimeline";
import type { TimelineEntry } from "@/types/timeline";
import { fetchTextOrNull } from "@/utils/fetchText";
import { getOriginalMdUrl } from "@/utils/contentPaths";
import { decodeArticleId, encodeArticleId } from "@/utils/timelineParser";

function getPrevNext(entries: TimelineEntry[], currentId: string) {
  const idx = entries.findIndex((e) => e.id === currentId);
  if (idx === -1) return { prevId: null, nextId: null };
  return {
    prevId: idx > 0 ? entries[idx - 1].id : null,
    nextId: idx < entries.length - 1 ? entries[idx + 1].id : null,
  };
}

export default function Original() {
  const { id } = useParams();
  const { data, loading, error } = useTimeline();

  const canonicalId = useMemo(() => {
    if (!id) return null;
    return encodeArticleId(decodeArticleId(id));
  }, [id]);

  const entry = useMemo(() => (canonicalId && data ? data.byId[canonicalId] : null), [canonicalId, data]);
  const nav = useMemo(
    () => (canonicalId && data ? getPrevNext(data.entries, canonicalId) : { prevId: null, nextId: null }),
    [canonicalId, data]
  );

  const [original, setOriginal] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!entry) return;
    setLoadingText(true);
    fetchTextOrNull(getOriginalMdUrl(entry))
      .then((t) => {
        if (cancelled) return;
        setOriginal(t);
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingText(false);
      });
    return () => {
      cancelled = true;
    };
  }, [entry]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-white/5" />
        <div className="h-56 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  if (error) {
    return <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>;
  }

  if (!entry) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-200">未找到该文章</div>
        <Link to="/" className="text-sm text-sky-300 hover:underline">
          返回目录
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs text-zinc-500">{entry.date}</div>
          <h1 className="mt-1 truncate text-xl font-semibold text-zinc-100">{entry.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/article/${entry.id}`}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/[0.06]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回解读</span>
          </Link>
          <div className="hidden sm:flex items-center gap-2 rounded-lg bg-black/30 px-3 py-2 text-sm text-zinc-300 ring-1 ring-white/10">
            <FileText className="h-4 w-4" />
            <span>原文</span>
          </div>
        </div>
      </div>

      <ArticleNav prevId={nav.prevId} nextId={nav.nextId} basePath="original" />

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        {loadingText ? <div className="h-48 animate-pulse rounded-xl bg-white/5" /> : null}
        {!loadingText && original ? <MarkdownView markdown={original} /> : null}
        {!loadingText && !original ? <p className="text-sm text-zinc-400">暂无原文资源</p> : null}
      </div>

      <div className="space-y-3">
        <ArticleNav prevId={nav.prevId} nextId={nav.nextId} basePath="original" />
        <Link to="/" className="block text-center text-sm text-sky-300 hover:underline">
          返回目录
        </Link>
      </div>
    </div>
  );
}
