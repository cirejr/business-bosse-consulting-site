import { sanitizeHtml } from "@/lib/utils/sanitize";
import { Markdown } from "./markdown";

function isMarkdown(content: string): boolean {
  if (!content) return false;
  
  const markdownIndicators = [
    /^#{1,6}\s/m,           // Headers
    /^\s*[-*+]\s/m,         // Unordered lists
    /^\s*\d+\.\s/m,         // Ordered lists
    /^\s*```/m,             // Code blocks
    /^\s*>/m,               // Blockquotes
    /\[.*\]\(.*\)/,         // Links
    /\*\*.*\*\*/,           // Bold
    /__.*__/,               // Bold alt
    /\*.*\*/,               // Italic
    /_.*_/,                 // Italic alt
    /`[^`]+`/,              // Inline code
    /^\s*[-*]\s\[ \]/m,     // Checkboxes
  ];
  
  const matchCount = markdownIndicators.filter(regex => regex.test(content)).length;
  
  return matchCount >= 2 || content.includes("```");
}

function isHtml(content: string): boolean {
  if (!content) return false;
  return content.trim().startsWith("<");
}

interface ArticleContentProps {
  content: string | null;
}

export function ArticleContent({ content }: ArticleContentProps) {
  if (!content) {
    return <p className="text-gray-500 italic">Contenu en attente...</p>;
  }

  if (isMarkdown(content)) {
    return <Markdown>{content}</Markdown>;
  }

  if (isHtml(content)) {
    return (
      <div 
        className="article-content html-content"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
      />
    );
  }

  return <Markdown>{content}</Markdown>;
}