import Link from "next/link";
import React, { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Partial<Components> = {
  code: ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    const isInline = !match && !className;
    
    if (isInline) {
      return (
        <code 
          className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-accent" 
          {...props}
        >
          {children}
        </code>
      );
    }
    
    return (
      <div className="not-prose flex flex-col my-4">
        <pre className="w-full overflow-x-auto rounded-xl border border-border p-4 text-sm text-foreground bg-muted/50">
          <code className="font-mono whitespace-pre-wrap break-words" {...props}>
            {children}
          </code>
        </pre>
      </div>
    );
  },
  pre: ({ children }) => <>{children}</>,
  p: ({ children, ...props }) => {
    return (
      <p className="mb-4 leading-relaxed text-gray-700" {...props}>
        {children}
      </p>
    );
  },
  ol: ({ children, ...props }) => {
    return (
      <ol className="ml-6 list-outside list-decimal mb-4 space-y-1" {...props}>
        {children}
      </ol>
    );
  },
  ul: ({ children, ...props }) => {
    return (
      <ul className="ml-6 list-outside list-disc mb-4 space-y-1" {...props}>
        {children}
      </ul>
    );
  },
  li: ({ children, ...props }) => {
    return (
      <li className="text-gray-700 leading-relaxed" {...props}>
        {children}
      </li>
    );
  },
  strong: ({ children, ...props }) => {
    return (
      <strong className="font-bold text-primary" {...props}>
        {children}
      </strong>
    );
  },
  em: ({ children, ...props }) => {
    return (
      <em className="italic" {...props}>
        {children}
      </em>
    );
  },
  a: ({ href, children, ...props }) => {
    if (!href) {
      return <span {...props}>{children}</span>;
    }
    
    const isInternal = href.startsWith("/") || href.startsWith("#");
    
    if (isInternal) {
      return (
        <Link href={href} className="text-accent font-medium hover:underline" {...props}>
          {children}
        </Link>
      );
    }
    
    return (
      <a
        href={href}
        className="text-accent font-medium hover:underline"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  },
  h1: ({ children, ...props }) => {
    return (
      <h1 className="text-4xl font-serif font-bold text-primary mb-6 mt-8" {...props}>
        {children}
      </h1>
    );
  },
  h2: ({ children, ...props }) => {
    return (
      <h2 className="text-3xl font-serif font-bold text-primary mb-4 mt-8" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }) => {
    return (
      <h3 className="text-2xl font-serif font-semibold text-primary mb-3 mt-6" {...props}>
        {children}
      </h3>
    );
  },
  h4: ({ children, ...props }) => {
    return (
      <h4 className="text-xl font-serif font-semibold text-primary mb-3 mt-6" {...props}>
        {children}
      </h4>
    );
  },
  h5: ({ children, ...props }) => {
    return (
      <h5 className="text-lg font-serif font-semibold text-primary mb-2 mt-4" {...props}>
        {children}
      </h5>
    );
  },
  h6: ({ children, ...props }) => {
    return (
      <h6 className="text-base font-serif font-medium text-primary mb-2 mt-4" {...props}>
        {children}
      </h6>
    );
  },
  blockquote: ({ children, ...props }) => {
    return (
      <blockquote className="border-l-4 border-accent pl-4 py-2 my-6 bg-muted/50 italic text-gray-700" {...props}>
        {children}
      </blockquote>
    );
  },
  hr: ({ ...props }) => {
    return <hr className="my-8 border-border" {...props} />;
  },
  table: ({ children, ...props }) => {
    return (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full divide-y divide-border border border-border" {...props}>
          {children}
        </table>
      </div>
    );
  },
  thead: ({ children, ...props }) => {
    return (
      <thead className="bg-muted" {...props}>
        {children}
      </thead>
    );
  },
  tbody: ({ children, ...props }) => {
    return (
      <tbody className="divide-y divide-border bg-white" {...props}>
        {children}
      </tbody>
    );
  },
  tr: ({ children, ...props }) => {
    return (
      <tr {...props}>
        {children}
      </tr>
    );
  },
  th: ({ children, ...props }) => {
    return (
      <th className="px-4 py-3 text-left text-sm font-semibold text-primary" {...props}>
        {children}
      </th>
    );
  },
  td: ({ children, ...props }) => {
    return (
      <td className="px-4 py-3 text-sm text-gray-700" {...props}>
        {children}
      </td>
    );
  },
  img: ({ src, alt, ...props }) => {
    if (!src) return null;
    return (
      <figure className="my-6">
        <img
          src={src}
          alt={alt || ""}
          className="rounded-lg max-w-full h-auto"
          loading="lazy"
          {...props}
        />
        {alt && (
          <figcaption className="text-center text-sm text-muted-foreground mt-2">
            {alt}
          </figcaption>
        )}
      </figure>
    );
  },
};

const remarkPlugins = [remarkGfm];

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  if (!children) return null;
  
  return (
    <div className="article-content">
      <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);