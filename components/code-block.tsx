"use client";

import { Geist_Mono } from "next/font/google";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface CodeBlockProps {
  node: any;
  inline: boolean;
  className: string;
  children: any;
}

export function CodeBlock({
  node,
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) {
  if (!inline) {
    return (
      <div className="not-prose flex flex-col">
        <pre
          {...props}
          className={`w-full overflow-x-auto rounded-xl border border-zinc-200 p-4 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50`}
        >
          <code
            className={`${geistMono.variable} font-[family-name:var(--font-geist-mono)] whitespace-pre-wrap break-words`}
          >
            {children}
          </code>
        </pre>
      </div>
    );
  } else {
    return (
      <code
        className={`${className} ${geistMono.variable} font-[family-name:var(--font-geist-mono)] text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md`}
        {...props}
      >
        {children}
      </code>
    );
  }
}
