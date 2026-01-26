import { Fragment, useMemo } from "react";

type Props = {
  markdown: string;
  className?: string;
};

type InlineToken =
  | { type: "text"; value: string }
  | { type: "code"; value: string }
  | { type: "strong"; value: InlineToken[] }
  | { type: "link"; text: InlineToken[]; href: string };

function tokenizeInline(input: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let i = 0;

  const pushText = (value: string) => {
    if (!value) return;
    const last = tokens[tokens.length - 1];
    if (last && last.type === "text") last.value += value;
    else tokens.push({ type: "text", value });
  };

  while (i < input.length) {
    if (input.startsWith("`", i)) {
      const end = input.indexOf("`", i + 1);
      if (end !== -1) {
        const value = input.slice(i + 1, end);
        tokens.push({ type: "code", value });
        i = end + 1;
        continue;
      }
    }

    if (input.startsWith("**", i)) {
      const end = input.indexOf("**", i + 2);
      if (end !== -1) {
        const inner = input.slice(i + 2, end);
        tokens.push({ type: "strong", value: tokenizeInline(inner) });
        i = end + 2;
        continue;
      }
    }

    if (input.startsWith("[", i)) {
      const mid = input.indexOf("](", i + 1);
      const end = input.indexOf(")", i + 1);
      if (mid !== -1 && end !== -1 && mid < end) {
        const text = input.slice(i + 1, mid);
        const href = input.slice(mid + 2, end);
        tokens.push({ type: "link", text: tokenizeInline(text), href });
        i = end + 1;
        continue;
      }
    }

    pushText(input[i]);
    i += 1;
  }

  return tokens;
}

function renderInline(tokens: InlineToken[]): React.ReactNode {
  return tokens.map((t, idx) => {
    if (t.type === "text") return <Fragment key={idx}>{t.value}</Fragment>;
    if (t.type === "code") {
      return (
        <code key={idx} className="rounded bg-white/5 px-1 py-0.5 font-mono text-[0.9em] text-zinc-100 ring-1 ring-white/10">
          {t.value}
        </code>
      );
    }
    if (t.type === "strong") return <strong key={idx} className="font-semibold text-zinc-100">{renderInline(t.value)}</strong>;
    return (
      <a
        key={idx}
        href={t.href}
        target="_blank"
        rel="noreferrer"
        className="text-sky-300 underline-offset-2 hover:underline"
      >
        {renderInline(t.text)}
      </a>
    );
  });
}

type Block =
  | { type: "h"; level: 1 | 2 | 3 | 4 | 5 | 6; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; lines: string[] }
  | { type: "code"; lang: string; code: string };

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.split(/\r?\n/);
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().startsWith("```")) {
      const lang = line.trim().slice(3).trim();
      i += 1;
      const codeLines: string[] = [];
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push({ type: "code", lang, code: codeLines.join("\n") });
      continue;
    }

    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const level = h[1].length as 1 | 2 | 3 | 4 | 5 | 6;
      blocks.push({ type: "h", level, text: h[2].trim() });
      i += 1;
      continue;
    }

    if (line.trim().startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].replace(/^\s*>\s?/, ""));
        i += 1;
      }
      blocks.push({ type: "quote", lines: quoteLines });
      continue;
    }

    if (line.match(/^\s*[-*]\s+/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\s*[-*]\s+/)) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i += 1;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (line.match(/^\s*\d+\.\s+/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\s*\d+\.\s+/)) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i += 1;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    if (!line.trim()) {
      i += 1;
      continue;
    }

    const paraLines: string[] = [line];
    i += 1;
    while (i < lines.length && lines[i].trim() && !lines[i].trim().startsWith("```")) {
      if (lines[i].match(/^(#{1,6})\s+/)) break;
      if (lines[i].trim().startsWith(">")) break;
      if (lines[i].match(/^\s*[-*]\s+/)) break;
      if (lines[i].match(/^\s*\d+\.\s+/)) break;
      paraLines.push(lines[i]);
      i += 1;
    }
    blocks.push({ type: "p", text: paraLines.join("\n") });
  }

  return blocks;
}

export default function MarkdownView({ markdown, className }: Props) {
  const blocks = useMemo(() => parseBlocks(markdown), [markdown]);

  return (
    <article className={className}>
      {blocks.map((b, idx) => {
        if (b.type === "h") {
          const Tag = `h${b.level}` as const;
          const cls =
            b.level === 1
              ? "mt-6 text-2xl font-semibold"
              : b.level === 2
              ? "mt-6 text-xl font-semibold"
              : "mt-5 text-base font-semibold";
          return (
            <Tag key={idx} className={`${cls} text-zinc-100`}>
              {renderInline(tokenizeInline(b.text))}
            </Tag>
          );
        }

        if (b.type === "quote") {
          return (
            <blockquote key={idx} className="mt-4 border-l-2 border-white/10 pl-4 text-sm text-zinc-300">
              {b.lines.map((l, i2) => (
                <p key={i2} className={i2 === 0 ? "" : "mt-2"}>
                  {renderInline(tokenizeInline(l))}
                </p>
              ))}
            </blockquote>
          );
        }

        if (b.type === "ul") {
          return (
            <ul key={idx} className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-200">
              {b.items.map((it, i2) => (
                <li key={i2}>{renderInline(tokenizeInline(it))}</li>
              ))}
            </ul>
          );
        }

        if (b.type === "ol") {
          return (
            <ol key={idx} className="mt-4 list-decimal space-y-2 pl-5 text-sm text-zinc-200">
              {b.items.map((it, i2) => (
                <li key={i2}>{renderInline(tokenizeInline(it))}</li>
              ))}
            </ol>
          );
        }

        if (b.type === "code") {
          return (
            <pre
              key={idx}
              className="mt-4 overflow-x-auto rounded-xl bg-black/50 p-4 text-xs text-zinc-200 ring-1 ring-white/10"
            >
              <code>{b.code}</code>
            </pre>
          );
        }

        return (
          <p key={idx} className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-200">
            {renderInline(tokenizeInline(b.text))}
          </p>
        );
      })}
    </article>
  );
}
