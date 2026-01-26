import { Link, Outlet, useLocation } from "react-router-dom";
import { BookOpenText } from "lucide-react";

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium hover:text-white">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
              <BookOpenText className="h-5 w-5" />
            </span>
            <span className="hidden sm:inline">毛选·静态资源阅读</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="hidden sm:inline">{location.pathname.startsWith("/article/") ? "文章" : "目录"}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 py-6">
        <div className="mx-auto max-w-6xl px-4 text-xs text-zinc-500">
          <p>仅用于个人学习与研究，请以权威出版物为准。</p>
        </div>
      </footer>
    </div>
  );
}
