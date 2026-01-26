import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCw, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  src: string | null;
  title?: string;
  className?: string;
};

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "00:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function AudioPlayer({ src, title, className }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    setReady(false);
    setError(null);
    setPlaying(false);
    setDuration(0);
    setCurrentTime(0);
  }, [src]);

  const canUse = Boolean(src);
  const progressMax = useMemo(() => (duration > 0 ? duration : 1), [duration]);

  return (
    <section className={cn("rounded-xl border border-white/10 bg-white/[0.03] p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Volume2 className="h-4 w-4" />
            <span>音频</span>
          </div>
          <div className="mt-1 line-clamp-2 text-sm font-medium text-zinc-100">{title || "解读朗读"}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          disabled={!canUse || error !== null}
          onClick={async () => {
            const el = audioRef.current;
            if (!el) return;
            if (el.paused) {
              try {
                await el.play();
              } catch {
                setError("音频无法播放");
              }
            } else {
              el.pause();
            }
          }}
          className={cn(
            "grid h-10 w-10 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10 transition",
            canUse && error === null ? "hover:bg-white/10" : "opacity-40"
          )}
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>

        <div className="flex-1">
          <input
            type="range"
            min={0}
            max={progressMax}
            step={0.1}
            value={Math.min(currentTime, progressMax)}
            disabled={!ready || error !== null}
            onChange={(e) => {
              const el = audioRef.current;
              if (!el) return;
              const next = Number(e.target.value);
              el.currentTime = next;
              setCurrentTime(next);
            }}
            className={cn("h-2 w-full cursor-pointer accent-white", (!ready || error) && "opacity-40")}
          />
          <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <button
          type="button"
          disabled={!ready || error !== null}
          onClick={() => {
            const el = audioRef.current;
            if (!el) return;
            el.currentTime = 0;
            el.pause();
          }}
          className={cn(
            "grid h-10 w-10 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10 transition",
            ready && error === null ? "hover:bg-white/10" : "opacity-40"
          )}
        >
          <RotateCw className="h-5 w-5" />
        </button>
      </div>

      {!canUse ? <p className="mt-3 text-xs text-zinc-500">暂无音频资源</p> : null}
      {error ? <p className="mt-3 text-xs text-red-300">{error}</p> : null}

      {src ? (
        <audio
          ref={audioRef}
          src={src}
          preload="metadata"
          onLoadedMetadata={(e) => {
            const el = e.currentTarget;
            setDuration(el.duration || 0);
            setReady(true);
          }}
          onTimeUpdate={(e) => {
            setCurrentTime(e.currentTarget.currentTime);
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setError("音频加载失败")}
          className="hidden"
        />
      ) : null}
    </section>
  );
}
