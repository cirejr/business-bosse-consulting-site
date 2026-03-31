"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface ArticleHeroProps {
  title: string;
  excerpt: string | null;
  publishedAt: Date | null;
  categories: { id: string; name: string; slug: string }[];
  coverImageUrl: string | null;
}

export function ArticleHero({
  title,
  excerpt,
  publishedAt,
  categories,
  coverImageUrl,
}: ArticleHeroProps) {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <section className="relative pt-40 pb-16 px-6 md:px-12 lg:px-24 bg-primary text-white overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center text-accent hover:underline mb-6 text-sm"
          >
            ← Retour aux articles
          </Link>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog?category=${cat.slug}`}
                  className="px-3 py-1 bg-white/10 text-white text-xs rounded-full hover:bg-white/20 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          {/* Date */}
          {formattedDate && (
            <div className="text-white/60 text-sm mb-4">{formattedDate}</div>
          )}

          {/* Title */}
          <h1 className="text-2xl md:text-4xl font-serif mb-6 leading-tight">
            {title}
          </h1>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-xl text-white/70 font-sans font-light leading-relaxed">
              {excerpt}
            </p>
          )}
        </motion.div>
      </div>

      {/* Cover Image */}
      {coverImageUrl && (
        <div className="absolute inset-0 z-0">
          <img
            src={coverImageUrl}
            alt={title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
        </div>
      )}

      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
        <svg
          className="w-full h-full text-white/5"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="article-grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#article-grid)" />
        </svg>
      </div>
    </section>
  );
}
