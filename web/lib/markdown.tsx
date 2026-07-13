import React from "react";

/**
 * A lightweight, dependency-free markdown parser that renders basic elements
 * into styled React components. Avoids any compatibility issues with package dependencies.
 */
export function renderMarkdown(markdown: string): React.ReactNode {
  if (!markdown) return null;
  
  // Split into blocks by double newlines (paragraphs, headers, lists)
  const blocks = markdown.split(/\n\n+/);
  
  return (
    <div className="space-y-4 font-sans text-slate-300 leading-relaxed text-sm">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Fenced Code Block: ```code```
        if (trimmed.startsWith("```")) {
          const lines = trimmed.split("\n");
          const code = lines.slice(1, lines.length - 1).join("\n");
          return (
            <pre
              key={i}
              className="p-4 bg-slate-950/80 border border-slate-900 rounded-lg overflow-x-auto text-xs font-mono text-indigo-300 my-4"
            >
              <code>{code}</code>
            </pre>
          );
        }

        // H1 Heading: # Title
        if (trimmed.startsWith("# ")) {
          return (
            <h1
              key={i}
              className="text-xl font-bold text-slate-100 tracking-tight pt-4 pb-1 border-b border-slate-900/60"
            >
              {parseInline(trimmed.substring(2))}
            </h1>
          );
        }

        // H2 Heading: ## Title
        if (trimmed.startsWith("## ")) {
          return (
            <h2
              key={i}
              className="text-lg font-semibold text-slate-200 tracking-tight pt-3"
            >
              {parseInline(trimmed.substring(3))}
            </h2>
          );
        }

        // H3 Heading: ### Title
        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={i}
              className="text-base font-semibold text-slate-300 tracking-tight pt-2"
            >
              {parseInline(trimmed.substring(4))}
            </h3>
          );
        }

        // Bullet lists: - or *
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          // Find all bullet points within this block
          const lines = trimmed.split("\n");
          return (
            <ul key={i} className="list-disc pl-5 space-y-1.5 my-2">
              {lines.map((line, j) => {
                const cleanLine = line.replace(/^[\-\*]\s+/, "");
                return <li key={j}>{parseInline(cleanLine)}</li>;
              })}
            </ul>
          );
        }

        // Standard paragraph
        return <p key={i}>{parseInline(trimmed)}</p>;
      })}
    </div>
  );
}

/**
 * Parses inline bold (**text**) and inline code (`code`) into React spans.
 */
function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let index = 0;
  
  // Matches either **content** or `content`
  const regex = /(\*\*|`)(.*?)\1/g;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    const matchIndex = match.index;
    
    // Add plain text preceding the match
    if (matchIndex > index) {
      parts.push(text.substring(index, matchIndex));
    }
    
    const type = match[1];
    const content = match[2];
    
    if (type === "**") {
      parts.push(
        <strong key={matchIndex} className="font-semibold text-slate-100">
          {content}
        </strong>
      );
    } else if (type === "`") {
      parts.push(
        <code
          key={matchIndex}
          className="px-1.5 py-0.5 bg-slate-900 border border-slate-850 rounded font-mono text-xs text-indigo-400"
        >
          {content}
        </code>
      );
    }
    
    index = regex.lastIndex;
  }
  
  // Add trailing plain text
  if (index < text.length) {
    parts.push(text.substring(index));
  }
  
  return parts;
}
