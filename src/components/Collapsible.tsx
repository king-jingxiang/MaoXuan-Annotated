import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  defaultOpen?: boolean;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export default function Collapsible({ title, defaultOpen, rightSlot, children, className }: Props) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  const contentId = useMemo(() => `collapsible-${Math.random().toString(16).slice(2)}`, []);

  return (
    <section className={cn("rounded-xl border border-white/10 bg-white/[0.03]", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-controls={contentId}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-zinc-100">{title}</div>
        </div>

        <div className="flex items-center gap-3">
          {rightSlot ? <div className="hidden sm:block">{rightSlot}</div> : null}
          <ChevronDown className={cn("h-4 w-4 shrink-0 text-zinc-400 transition-transform", open && "rotate-180")} />
        </div>
      </button>
      <div id={contentId} className={cn("px-4 pb-4", open ? "block" : "hidden")}>
        {children}
      </div>
    </section>
  );
}
