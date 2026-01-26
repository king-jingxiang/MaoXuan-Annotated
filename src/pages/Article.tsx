import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ExternalLink, FileText, Image as ImageIcon } from "lucide-react";
import ArticleNav from "@/components/ArticleNav";
import AudioPlayer from "@/components/AudioPlayer";
import Collapsible from "@/components/Collapsible";
import MarkdownView from "@/components/MarkdownView";
import { useTimeline } from "@/hooks/useTimeline";
import type { TimelineEntry } from "@/types/timeline";
import { fetchTextOrNull } from "@/utils/fetchText";
import { decodeArticleId, encodeArticleId } from "@/utils/timelineParser";
import {
  getAudioUrl,
  getDiagramImageUrl,
  getInfoImageUrl,
  getInterpretationMdUrl,
  getOriginalMdUrl,
} from "@/utils/contentPaths";

function getPrevNext(entries: TimelineEntry[], currentId: string) {
  const idx = entries.findIndex((e) => e.id === currentId);
  if (idx === -1) return { prevId: null, nextId: null };
  return {
    prevId: idx > 0 ? entries[idx - 1].id : null,
    nextId: idx < entries.length - 1 ? entries[idx + 1].id : null,
  };
}

export default function Article() {
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
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  const originalPreview = useMemo(() => {
    if (!original) return null;
    const lines = original.split(/\r?\n/).filter((l) => l.trim());
    return lines.slice(0, 16).join("\n");
  }, [original]);

  useEffect(() => {
    let cancelled = false;
    if (!entry) return;
    setLoadingContent(true);
    setAudioSrc(getAudioUrl(entry));
    Promise.all([
      fetchTextOrNull(getOriginalMdUrl(entry)),
      fetchTextOrNull(getInterpretationMdUrl(entry)),
    ])
      .then(([o, i2]) => {
        if (cancelled) return;
        setOriginal(o);
        setInterpretation(i2);
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingContent(false);
      });
    return () => {
      cancelled = true;
    };
  }, [entry]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-white/5" />
        <div className="h-48 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-48 animate-pulse rounded-2xl bg-white/5" />
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

  const infoImageUrl = getInfoImageUrl(entry);
  const diagramImageUrl = getDiagramImageUrl(entry);
  const audioUrl = audioSrc;
  const originalHref = `/article/${entry.id}/original`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs text-zinc-500">{entry.date}</div>
          <h1 className="mt-1 truncate text-xl font-semibold text-zinc-100">{entry.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
            <span className="rounded-md bg-black/30 px-2 py-1 ring-1 ring-white/10">{entry.volume}</span>
            <span className="truncate">{entry.relPath}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={originalHref}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/[0.06]"
          >
            <FileText className="h-4 w-4" />
            <span>查看原文</span>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                <ImageIcon className="h-4 w-4 text-zinc-400" />
                <span>信息图（16:9）</span>
              </div>
              <a
                href={infoImageUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200"
              >
                <span>新标签页打开</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="mt-3 overflow-hidden rounded-xl ring-1 ring-white/10">
              <div className="aspect-video bg-black/30">
                <img src={infoImageUrl} alt={`${entry.title} 信息图`} className="h-full w-full object-contain" loading="lazy" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                <ImageIcon className="h-4 w-4 text-zinc-400" />
                <span>知识图解（9:16）</span>
              </div>
              <a
                href={diagramImageUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200"
              >
                <span>新标签页打开</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="mt-3 overflow-hidden rounded-xl ring-1 ring-white/10">
              <div className="aspect-[9/16] bg-black/30">
                <img src={diagramImageUrl} alt={`${entry.title} 知识图解`} className="h-full w-full object-contain" loading="lazy" />
              </div>
            </div>
          </div>

          <Collapsible
            title="解读（可折叠）"
            defaultOpen
            rightSlot={
              loadingContent ? (
                <span className="rounded-md bg-black/30 px-2 py-1 text-[11px] text-zinc-400 ring-1 ring-white/10">加载中</span>
              ) : interpretation ? (
                <span className="rounded-md bg-black/30 px-2 py-1 text-[11px] text-zinc-400 ring-1 ring-white/10">已加载</span>
              ) : (
                <span className="rounded-md bg-black/30 px-2 py-1 text-[11px] text-zinc-400 ring-1 ring-white/10">暂无</span>
              )
            }
          >
            {interpretation ? (
              <MarkdownView markdown={interpretation} />
            ) : (
              <p className="text-sm text-zinc-400">暂无解读资源</p>
            )}
          </Collapsible>

          <Collapsible
            title="原文预览（建议独立查看）"
            rightSlot={
              <Link to={originalHref} className="inline-flex items-center gap-2 text-xs text-sky-300 hover:underline">
                <span>查看原文</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            }
          >
            {originalPreview ? (
              <pre className="whitespace-pre-wrap rounded-xl bg-black/40 p-4 text-xs leading-6 text-zinc-200 ring-1 ring-white/10">
                {originalPreview}
              </pre>
            ) : (
              <p className="text-sm text-zinc-400">暂无原文资源</p>
            )}
          </Collapsible>

          <ArticleNav prevId={nav.prevId} nextId={nav.nextId} basePath="detail" className="pt-2" />
        </section>

        <aside className="space-y-4">
          <AudioPlayer src={audioUrl} title={entry.title} />

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-xs text-zinc-400">导航</div>
            <ArticleNav prevId={nav.prevId} nextId={nav.nextId} basePath="detail" className="mt-3" />
            <Link
              to="/"
              className="mt-3 block rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-center text-sm text-zinc-200 transition hover:bg-white/[0.06]"
            >
              返回目录
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
