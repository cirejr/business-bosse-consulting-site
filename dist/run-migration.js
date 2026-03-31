"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("../../db");
var schema_1 = require("../../db/schema");
var wp_parser_1 = require("./wp-parser");
var drizzle_orm_1 = require("drizzle-orm");
function runMigration() {
    return __awaiter(this, void 0, void 0, function () {
        var dumpPath, _a, terms, posts, meta, termRelationships, adminUsers, authorId, wpCategories, _i, wpCategories_1, c, wpTags, _b, wpTags_1, t, wpAttachments, _c, wpAttachments_1, m, attachedFile, filePath, url, wpPosts, _d, wpPosts_1, p, cleanedContent, newArticleId, thumbnailId, coverUrl, mediaItem, relatedTermTaxIds, _e, relatedTermTaxIds_1, termTaxId, termTaxonomyMeta, termId, cat, t, err_1;
        var _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    console.log("🚀 Starting WordPress to Next.js Migration...");
                    dumpPath = "docs/bbcons-wp-db-dump.sql";
                    return [4 /*yield*/, (0, wp_parser_1.parseWpDump)(dumpPath)];
                case 1:
                    _a = _h.sent(), terms = _a.terms, posts = _a.posts, meta = _a.meta, termRelationships = _a.termRelationships;
                    return [4 /*yield*/, db_1.db.select().from(schema_1.user).limit(1)];
                case 2:
                    adminUsers = _h.sent();
                    if (adminUsers.length === 0) {
                        console.error("❌ No admin user found in database. Please run the seed script first.");
                        return [2 /*return*/];
                    }
                    authorId = adminUsers[0].id;
                    // 2. Import Categories
                    console.log("📂 Importing Categories...");
                    wpCategories = Array.from(terms.values()).filter(function (t) { return t.taxonomy === "category"; });
                    _i = 0, wpCategories_1 = wpCategories;
                    _h.label = 3;
                case 3:
                    if (!(_i < wpCategories_1.length)) return [3 /*break*/, 6];
                    c = wpCategories_1[_i];
                    return [4 /*yield*/, db_1.db.insert(schema_1.category).values({
                            id: crypto.randomUUID(),
                            name: c.name,
                            slug: c.slug || c.name.toLowerCase().replace(/ /g, "-"),
                            wpId: c.term_id,
                        }).onConflictDoNothing()];
                case 4:
                    _h.sent();
                    _h.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    // 3. Import Tags
                    console.log("🏷️ Importing Tags...");
                    wpTags = Array.from(terms.values()).filter(function (t) { return t.taxonomy === "post_tag"; });
                    _b = 0, wpTags_1 = wpTags;
                    _h.label = 7;
                case 7:
                    if (!(_b < wpTags_1.length)) return [3 /*break*/, 10];
                    t = wpTags_1[_b];
                    return [4 /*yield*/, db_1.db.insert(schema_1.tag).values({
                            id: crypto.randomUUID(),
                            name: t.name,
                            slug: t.slug || t.name.toLowerCase().replace(/ /g, "-"),
                            wpId: t.term_id,
                        }).onConflictDoNothing()];
                case 8:
                    _h.sent();
                    _h.label = 9;
                case 9:
                    _b++;
                    return [3 /*break*/, 7];
                case 10:
                    // 4. Import Media (Attachments)
                    console.log("🖼️ Importing Media...");
                    wpAttachments = posts.filter(function (p) { return p.type === "attachment"; });
                    _c = 0, wpAttachments_1 = wpAttachments;
                    _h.label = 11;
                case 11:
                    if (!(_c < wpAttachments_1.length)) return [3 /*break*/, 14];
                    m = wpAttachments_1[_c];
                    attachedFile = (_f = meta.get(m.id)) === null || _f === void 0 ? void 0 : _f.get("_wp_attached_file");
                    filePath = attachedFile || "".concat(m.date.split(' ')[0].split('-')[0], "/").concat(m.date.split(' ')[0].split('-')[1], "/").concat(m.title);
                    url = "/uploads/".concat(filePath);
                    return [4 /*yield*/, db_1.db.insert(schema_1.media).values({
                            id: crypto.randomUUID(),
                            name: m.title,
                            url: url,
                            type: m.mime_type,
                            wpId: m.id,
                        }).onConflictDoNothing()];
                case 12:
                    _h.sent();
                    _h.label = 13;
                case 13:
                    _c++;
                    return [3 /*break*/, 11];
                case 14:
                    // 5. Import Articles (Posts)
                    console.log("📝 Importing Articles...");
                    wpPosts = posts.filter(function (p) { return p.type === "post" && p.status === "publish"; });
                    _d = 0, wpPosts_1 = wpPosts;
                    _h.label = 15;
                case 15:
                    if (!(_d < wpPosts_1.length)) return [3 /*break*/, 29];
                    p = wpPosts_1[_d];
                    cleanedContent = p.content
                        .replace(/<!-- wp:.*? -->/g, "")
                        .replace(/<!-- \/wp:.*? -->/g, "");
                    newArticleId = crypto.randomUUID();
                    thumbnailId = (_g = meta.get(p.id)) === null || _g === void 0 ? void 0 : _g.get("_thumbnail_id");
                    coverUrl = null;
                    if (!thumbnailId) return [3 /*break*/, 17];
                    return [4 /*yield*/, db_1.db.select().from(schema_1.media).where((0, drizzle_orm_1.eq)(schema_1.media.wpId, parseInt(thumbnailId))).limit(1)];
                case 16:
                    mediaItem = _h.sent();
                    if (mediaItem.length > 0) {
                        coverUrl = mediaItem[0].url;
                    }
                    _h.label = 17;
                case 17:
                    _h.trys.push([17, 27, , 28]);
                    return [4 /*yield*/, db_1.db.insert(schema_1.article).values({
                            id: newArticleId,
                            title: p.title,
                            slug: p.slug || p.title.toLowerCase().replace(/ /g, "-"),
                            content: cleanedContent,
                            excerpt: p.excerpt,
                            status: "published",
                            authorId: authorId,
                            coverImageUrl: coverUrl,
                            wpId: p.id,
                            publishedAt: new Date(p.date),
                        }).onConflictDoNothing()];
                case 18:
                    _h.sent();
                    relatedTermTaxIds = termRelationships.get(p.id) || [];
                    _e = 0, relatedTermTaxIds_1 = relatedTermTaxIds;
                    _h.label = 19;
                case 19:
                    if (!(_e < relatedTermTaxIds_1.length)) return [3 /*break*/, 26];
                    termTaxId = relatedTermTaxIds_1[_e];
                    termTaxonomyMeta = meta.get(termTaxId);
                    termId = termTaxonomyMeta ? parseInt(termTaxonomyMeta.get("term_id") || "") : null;
                    if (!termId) return [3 /*break*/, 25];
                    return [4 /*yield*/, db_1.db.select().from(schema_1.category).where((0, drizzle_orm_1.eq)(schema_1.category.wpId, termId)).limit(1)];
                case 20:
                    cat = _h.sent();
                    if (!(cat.length > 0)) return [3 /*break*/, 22];
                    return [4 /*yield*/, db_1.db.insert(schema_1.articleCategories).values({
                            articleId: newArticleId,
                            categoryId: cat[0].id,
                        }).onConflictDoNothing()];
                case 21:
                    _h.sent();
                    _h.label = 22;
                case 22: return [4 /*yield*/, db_1.db.select().from(schema_1.tag).where((0, drizzle_orm_1.eq)(schema_1.tag.wpId, termId)).limit(1)];
                case 23:
                    t = _h.sent();
                    if (!(t.length > 0)) return [3 /*break*/, 25];
                    return [4 /*yield*/, db_1.db.insert(schema_1.articleTags).values({
                            articleId: newArticleId,
                            tagId: t[0].id,
                        }).onConflictDoNothing()];
                case 24:
                    _h.sent();
                    _h.label = 25;
                case 25:
                    _e++;
                    return [3 /*break*/, 19];
                case 26: return [3 /*break*/, 28];
                case 27:
                    err_1 = _h.sent();
                    console.error("Skipping article ".concat(p.id, " due to error (likely exists): ").concat(err_1));
                    return [3 /*break*/, 28];
                case 28:
                    _d++;
                    return [3 /*break*/, 15];
                case 29:
                    console.log("✅ Migration Completed Successfully!");
                    return [2 /*return*/];
            }
        });
    });
}
runMigration().catch(console.error);
