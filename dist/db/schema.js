"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.articleTagsRelations = exports.articleCategoriesRelations = exports.mediaRelations = exports.tagRelations = exports.categoryRelations = exports.articleRelations = exports.articleTags = exports.articleCategories = exports.media = exports.tag = exports.category = exports.article = exports.accountRelations = exports.sessionRelations = exports.userRelations = exports.verification = exports.account = exports.session = exports.user = void 0;
var drizzle_orm_1 = require("drizzle-orm");
var pg_core_1 = require("drizzle-orm/pg-core");
exports.user = (0, pg_core_1.pgTable)("user", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    email: (0, pg_core_1.text)("email").notNull().unique(),
    emailVerified: (0, pg_core_1.boolean)("email_verified").default(false).notNull(),
    image: (0, pg_core_1.text)("image"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at")
        .defaultNow()
        .$onUpdate(function () { /* @__PURE__ */ return new Date(); })
        .notNull(),
});
exports.session = (0, pg_core_1.pgTable)("session", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    expiresAt: (0, pg_core_1.timestamp)("expires_at").notNull(),
    token: (0, pg_core_1.text)("token").notNull().unique(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at")
        .$onUpdate(function () { /* @__PURE__ */ return new Date(); })
        .notNull(),
    ipAddress: (0, pg_core_1.text)("ip_address"),
    userAgent: (0, pg_core_1.text)("user_agent"),
    userId: (0, pg_core_1.text)("user_id")
        .notNull()
        .references(function () { return exports.user.id; }, { onDelete: "cascade" }),
}, function (table) { return [(0, pg_core_1.index)("session_userId_idx").on(table.userId)]; });
exports.account = (0, pg_core_1.pgTable)("account", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    accountId: (0, pg_core_1.text)("account_id").notNull(),
    providerId: (0, pg_core_1.text)("provider_id").notNull(),
    userId: (0, pg_core_1.text)("user_id")
        .notNull()
        .references(function () { return exports.user.id; }, { onDelete: "cascade" }),
    accessToken: (0, pg_core_1.text)("access_token"),
    refreshToken: (0, pg_core_1.text)("refresh_token"),
    idToken: (0, pg_core_1.text)("id_token"),
    accessTokenExpiresAt: (0, pg_core_1.timestamp)("access_token_expires_at"),
    refreshTokenExpiresAt: (0, pg_core_1.timestamp)("refreshTokenExpiresAt"),
    scope: (0, pg_core_1.text)("scope"),
    password: (0, pg_core_1.text)("password"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at")
        .$onUpdate(function () { /* @__PURE__ */ return new Date(); })
        .notNull(),
}, function (table) { return [(0, pg_core_1.index)("account_userId_idx").on(table.userId)]; });
exports.verification = (0, pg_core_1.pgTable)("verification", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    identifier: (0, pg_core_1.text)("identifier").notNull(),
    value: (0, pg_core_1.text)("value").notNull(),
    expiresAt: (0, pg_core_1.timestamp)("expires_at").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at")
        .defaultNow()
        .$onUpdate(function () { /* @__PURE__ */ return new Date(); })
        .notNull(),
}, function (table) { return [(0, pg_core_1.index)("verification_identifier_idx").on(table.identifier)]; });
exports.userRelations = (0, drizzle_orm_1.relations)(exports.user, function (_a) {
    var many = _a.many;
    return ({
        sessions: many(exports.session),
        accounts: many(exports.account),
        articles: many(exports.article),
    });
});
exports.sessionRelations = (0, drizzle_orm_1.relations)(exports.session, function (_a) {
    var one = _a.one;
    return ({
        user: one(exports.user, {
            fields: [exports.session.userId],
            references: [exports.user.id],
        }),
    });
});
exports.accountRelations = (0, drizzle_orm_1.relations)(exports.account, function (_a) {
    var one = _a.one;
    return ({
        user: one(exports.user, {
            fields: [exports.account.userId],
            references: [exports.user.id],
        }),
    });
});
// --- CMS Tables ---
exports.article = (0, pg_core_1.pgTable)("article", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    title: (0, pg_core_1.text)("title").notNull(),
    slug: (0, pg_core_1.text)("slug").notNull().unique(),
    content: (0, pg_core_1.text)("content"),
    excerpt: (0, pg_core_1.text)("excerpt"),
    coverImageUrl: (0, pg_core_1.text)("cover_image_url"),
    status: (0, pg_core_1.text)("status", { enum: ["draft", "published"] })
        .default("draft")
        .notNull(),
    authorId: (0, pg_core_1.text)("author_id")
        .notNull()
        .references(function () { return exports.user.id; }, { onDelete: "cascade" }),
    publishedAt: (0, pg_core_1.timestamp)("published_at"),
    wpId: (0, pg_core_1.integer)("wp_id"), // Original WordPress post ID
    meta: (0, pg_core_1.jsonb)("meta"), // Temporary storage for migration metadata
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at")
        .defaultNow()
        .$onUpdate(function () { /* @__PURE__ */ return new Date(); })
        .notNull(),
}, function (table) { return [
    (0, pg_core_1.index)("article_authorId_idx").on(table.authorId),
    (0, pg_core_1.index)("article_slug_idx").on(table.slug),
    (0, pg_core_1.index)("article_wpId_idx").on(table.wpId),
]; });
exports.category = (0, pg_core_1.pgTable)("category", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    slug: (0, pg_core_1.text)("slug").notNull().unique(),
    wpId: (0, pg_core_1.integer)("wp_id"), // Original WordPress term ID
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at")
        .defaultNow()
        .$onUpdate(function () { /* @__PURE__ */ return new Date(); })
        .notNull(),
}, function (table) { return [
    (0, pg_core_1.index)("category_slug_idx").on(table.slug),
    (0, pg_core_1.index)("category_wpId_idx").on(table.wpId),
]; });
exports.tag = (0, pg_core_1.pgTable)("tag", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    slug: (0, pg_core_1.text)("slug").notNull().unique(),
    wpId: (0, pg_core_1.integer)("wp_id"), // Original WordPress term ID
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at")
        .defaultNow()
        .$onUpdate(function () { /* @__PURE__ */ return new Date(); })
        .notNull(),
}, function (table) { return [
    (0, pg_core_1.index)("tag_slug_idx").on(table.slug),
    (0, pg_core_1.index)("tag_wpId_idx").on(table.wpId),
]; });
exports.media = (0, pg_core_1.pgTable)("media", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    url: (0, pg_core_1.text)("url").notNull(),
    type: (0, pg_core_1.text)("type"), // MIME type
    size: (0, pg_core_1.integer)("size"),
    wpId: (0, pg_core_1.integer)("wp_id"), // Original WordPress attachment ID
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at")
        .defaultNow()
        .$onUpdate(function () { /* @__PURE__ */ return new Date(); })
        .notNull(),
}, function (table) { return [(0, pg_core_1.index)("media_wpId_idx").on(table.wpId)]; });
exports.articleCategories = (0, pg_core_1.pgTable)("article_categories", {
    articleId: (0, pg_core_1.text)("article_id")
        .notNull()
        .references(function () { return exports.article.id; }, { onDelete: "cascade" }),
    categoryId: (0, pg_core_1.text)("category_id")
        .notNull()
        .references(function () { return exports.category.id; }, { onDelete: "cascade" }),
}, function (table) { return [
    (0, pg_core_1.primaryKey)({ columns: [table.articleId, table.categoryId] }),
]; });
exports.articleTags = (0, pg_core_1.pgTable)("article_tags", {
    articleId: (0, pg_core_1.text)("article_id")
        .notNull()
        .references(function () { return exports.article.id; }, { onDelete: "cascade" }),
    tagId: (0, pg_core_1.text)("tag_id")
        .notNull()
        .references(function () { return exports.tag.id; }, { onDelete: "cascade" }),
}, function (table) { return [
    (0, pg_core_1.primaryKey)({ columns: [table.articleId, table.tagId] }),
]; });
// --- CMS Relations ---
exports.articleRelations = (0, drizzle_orm_1.relations)(exports.article, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        author: one(exports.user, {
            fields: [exports.article.authorId],
            references: [exports.user.id],
        }),
        categories: many(exports.articleCategories),
        tags: many(exports.articleTags),
    });
});
exports.categoryRelations = (0, drizzle_orm_1.relations)(exports.category, function (_a) {
    var many = _a.many;
    return ({
        articles: many(exports.articleCategories),
    });
});
exports.tagRelations = (0, drizzle_orm_1.relations)(exports.tag, function (_a) {
    var many = _a.many;
    return ({
        articles: many(exports.articleTags),
    });
});
exports.mediaRelations = (0, drizzle_orm_1.relations)(exports.media, function (_a) {
    var many = _a.many;
    return ({
    // Potential for future relations (e.g., articles using this media)
    });
});
exports.articleCategoriesRelations = (0, drizzle_orm_1.relations)(exports.articleCategories, function (_a) {
    var one = _a.one;
    return ({
        article: one(exports.article, {
            fields: [exports.articleCategories.articleId],
            references: [exports.article.id],
        }),
        category: one(exports.category, {
            fields: [exports.articleCategories.categoryId],
            references: [exports.category.id],
        }),
    });
});
exports.articleTagsRelations = (0, drizzle_orm_1.relations)(exports.articleTags, function (_a) {
    var one = _a.one;
    return ({
        article: one(exports.article, {
            fields: [exports.articleTags.articleId],
            references: [exports.article.id],
        }),
        tag: one(exports.tag, {
            fields: [exports.articleTags.tagId],
            references: [exports.tag.id],
        }),
    });
});
