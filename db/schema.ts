import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, primaryKey, integer, jsonb } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  articles: many(article),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

// --- CMS Tables ---

export const article = pgTable(
  "article",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    content: text("content"),
    excerpt: text("excerpt"),
    coverImageUrl: text("cover_image_url"),
    status: text("status", { enum: ["draft", "published"] })
      .default("draft")
      .notNull(),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    publishedAt: timestamp("published_at"),
    wpId: integer("wp_id"), // Original WordPress post ID
    meta: jsonb("meta"), // Temporary storage for migration metadata
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("article_authorId_idx").on(table.authorId),
    index("article_slug_idx").on(table.slug),
    index("article_wpId_idx").on(table.wpId),
  ],
);

export const category = pgTable(
  "category",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    wpId: integer("wp_id"), // Original WordPress term ID
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("category_slug_idx").on(table.slug),
    index("category_wpId_idx").on(table.wpId),
  ],
);

export const tag = pgTable(
  "tag",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    wpId: integer("wp_id"), // Original WordPress term ID
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("tag_slug_idx").on(table.slug),
    index("tag_wpId_idx").on(table.wpId),
  ],
);

export const media = pgTable(
  "media",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    type: text("type"), // MIME type
    size: integer("size"),
    wpId: integer("wp_id"), // Original WordPress attachment ID
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("media_wpId_idx").on(table.wpId)],
);

export const articleCategories = pgTable(
  "article_categories",
  {
    articleId: text("article_id")
      .notNull()
      .references(() => article.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => category.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.articleId, table.categoryId] }),
  ],
);

export const articleTags = pgTable(
  "article_tags",
  {
    articleId: text("article_id")
      .notNull()
      .references(() => article.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.articleId, table.tagId] }),
  ],
);

// --- CMS Relations ---

export const articleRelations = relations(article, ({ one, many }) => ({
  author: one(user, {
    fields: [article.authorId],
    references: [user.id],
  }),
  categories: many(articleCategories),
  tags: many(articleTags),
}));

export const categoryRelations = relations(category, ({ many }) => ({
  articles: many(articleCategories),
}));

export const tagRelations = relations(tag, ({ many }) => ({
  articles: many(articleTags),
}));

export const mediaRelations = relations(media, ({ many }) => ({
  // Potential for future relations (e.g., articles using this media)
}));

export const articleCategoriesRelations = relations(articleCategories, ({ one }) => ({
  article: one(article, {
    fields: [articleCategories.articleId],
    references: [article.id],
  }),
  category: one(category, {
    fields: [articleCategories.categoryId],
    references: [category.id],
  }),
}));

export const articleTagsRelations = relations(articleTags, ({ one }) => ({
  article: one(article, {
    fields: [articleTags.articleId],
    references: [article.id],
  }),
  tag: one(tag, {
    fields: [articleTags.tagId],
    references: [tag.id],
  }),
}));
