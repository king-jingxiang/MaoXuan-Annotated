import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  prevId: string | null;
  nextId: string | null;
  basePath: "detail" | "original";
  className?: string;
};

function toHref(id: string, basePath: Props["basePath"]) {
  return basePath === "detail" ? `/article/${id}` : `/article/${id}/original`;
}

export default function ArticleNav({ prevId, nextId, basePath, className }: Props) {
  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      {prevId ? (
        <Link
          to={toHref(prevId, basePath)}
          className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/[0.06]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>上一章</span>
        </Link>
      ) : (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-zinc-500">
          <ArrowLeft className="h-4 w-4" />
          <span>上一章</span>
        </div>
      )}

      {nextId ? (
        <Link
          to={toHref(nextId, basePath)}
          className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/[0.06]"
        >
          <span>下一章</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-zinc-500">
          <span>下一章</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
