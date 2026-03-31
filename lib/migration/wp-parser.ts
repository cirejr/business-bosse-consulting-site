import fs from "fs";
import readline from "readline";

export interface WpTerm {
  term_id: number;
  name: string;
  slug: string;
  taxonomy: string;
}

export interface WpPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  status: string;
  type: string;
  mime_type: string;
  thumbnail_id?: number;
}

export async function parseWpDump(filePath: string) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const terms: Map<number, WpTerm> = new Map();
  const posts: WpPost[] = [];
  const meta: Map<number, Map<string, string>> = new Map();
  const termRelationships: Map<number, number[]> = new Map();

  console.log("Starting SQL dump parsing (Robust-Streaming)...");

  let currentTable = "";
  let buffer = "";

  for await (const line of rl) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Detect table context change
    if (trimmedLine.includes("INSERT INTO `wp_terms`")) {
      currentTable = "wp_terms";
      continue;
    } else if (trimmedLine.includes("INSERT INTO `wp_term_taxonomy`")) {
      currentTable = "wp_term_taxonomy";
      continue;
    } else if (trimmedLine.includes("INSERT INTO `wp_posts`")) {
      currentTable = "wp_posts";
      continue;
    } else if (trimmedLine.includes("INSERT INTO `wp_postmeta`")) {
      currentTable = "wp_postmeta";
      continue;
    } else if (trimmedLine.includes("INSERT INTO `wp_term_relationships`")) {
      currentTable = "wp_term_relationships";
      continue;
    } else if (trimmedLine.startsWith("UNLOCK TABLES;") || (trimmedLine.startsWith("CREATE TABLE") && !trimmedLine.includes("INSERT"))) {
      currentTable = "";
      continue;
    }

    if (!currentTable) continue;

    buffer += (buffer ? " " : "") + trimmedLine;

    // Process all completed rows in the buffer
    while (true) {
      const startIdx = buffer.indexOf("(");
      if (startIdx === -1) {
        buffer = ""; // Should not happen often if we're in table context
        break;
      }

      let endIdx = -1;
      let inString = false;
      let escaped = false;
      for (let j = startIdx + 1; j < buffer.length; j++) {
        const char = buffer[j];
        if (escaped) {
          escaped = false;
          continue;
        }
        if (char === "\\") {
          escaped = true;
          continue;
        }
        if (char === "'") {
          inString = !inString;
          continue;
        }
        if (char === ")" && !inString) {
          endIdx = j;
          break;
        }
      }

      if (endIdx !== -1) {
        const rowContent = buffer.slice(startIdx + 1, endIdx);
        handleRow(currentTable, rowContent, terms, posts, meta, termRelationships);
        
        // Move past the row and look for the next one
        let nextStart = endIdx + 1;
        // Skip trailing comma or space
        while (nextStart < buffer.length && (buffer[nextStart] === "," || buffer[nextStart] === " " || buffer[nextStart] === ";")) {
          nextStart++;
        }
        buffer = buffer.slice(nextStart);
      } else {
        // Incomplete row, wait for more data
        break;
      }
    }
  }

  console.log(`Parsed ${terms.size} terms`);
  const postCount = posts.filter(p => p.type === "post").length;
  const attachCount = posts.filter(p => p.type === "attachment").length;
  console.log(`Parsed ${postCount} posts and ${attachCount} attachments`);
  console.log(`Parsed meta for ${meta.size} items`);

  return { terms, posts, meta, termRelationships };
}

function handleRow(table: string, content: string, terms: Map<number, WpTerm>, posts: WpPost[], meta: Map<number, Map<string, string>>, rels: Map<number, number[]>) {
  if (table === "wp_terms") {
    extractTermsRow(content, terms);
  } else if (table === "wp_term_taxonomy") {
    applyTaxonomyRow(content, terms);
  } else if (table === "wp_posts") {
    extractPostsRow(content, posts);
  } else if (table === "wp_postmeta") {
    extractMetaRow(content, meta);
  } else if (table === "wp_term_relationships") {
    extractRelationshipsRow(content, rels);
  }
}

function extractTermsRow(rowContent: string, termsMap: Map<number, WpTerm>) {
  const parts = splitSqlValues(rowContent);
  if (parts.length < 3) return;
  const id = parseInt(parts[0]);
  const name = parts[1].replace(/^'|'$/g, "").replace(/\\'/g, "'");
  const slug = parts[2].replace(/^'|'$/g, "").replace(/\\'/g, "'");
  termsMap.set(id, { term_id: id, name, slug, taxonomy: "" });
}

function applyTaxonomyRow(rowContent: string, termsMap: Map<number, WpTerm>) {
  const parts = splitSqlValues(rowContent);
  if (parts.length < 3) return;
  const termId = parseInt(parts[1]);
  const taxonomy = parts[2].replace(/^'|'$/g, "").replace(/\\'/g, "'");
  const term = termsMap.get(termId);
  if (term) {
    term.taxonomy = taxonomy;
  }
}

function extractPostsRow(rowContent: string, posts: WpPost[]) {
  const parts = splitSqlValues(rowContent);
  
  if (parts.length < 22) {
    return;
  }

  try {
    const id = parseInt(parts[0]);
    const date = parts[2].replace(/^'|'$/g, "");
    const content = parts[4].replace(/^'|'$/g, "").replace(/\\'/g, "'").replace(/\\n/g, "\n").replace(/\\r/g, "\r");
    const title = parts[5].replace(/^'|'$/g, "").replace(/\\'/g, "'");
    const excerpt = parts[6].replace(/^'|'$/g, "").replace(/\\'/g, "'");
    const status = parts[7].replace(/^'|'$/g, "");
    const slug = parts[11].replace(/^'|'$/g, "");
    const type = parts[20].replace(/^'|'$/g, "");
    const mimeType = parts[21].replace(/^'|'$/g, "");

    posts.push({
      id,
      date,
      content,
      title,
      excerpt,
      status,
      slug,
      type,
      mime_type: mimeType,
    });
  } catch (err) {
    // console.error(`Error parsing wp_posts row: ${err}`);
  }
}

function extractMetaRow(rowContent: string, metaMap: Map<number, Map<string, string>>) {
  const parts = splitSqlValues(rowContent);
  if (parts.length < 4) return;
  const postId = parseInt(parts[1]);
  const key = parts[2].replace(/^'|'$/g, "");
  const value = parts[3].replace(/^'|'$/g, "").replace(/\\'/g, "'");

  if (!metaMap.has(postId)) {
    metaMap.set(postId, new Map());
  }
  metaMap.get(postId)!.set(key, value);
}

function extractRelationshipsRow(rowContent: string, relMap: Map<number, number[]>) {
  const parts = splitSqlValues(rowContent);
  if (parts.length < 2) return;
  const objectId = parseInt(parts[0]);
  const termTaxonomyId = parseInt(parts[1]);

  if (!relMap.has(objectId)) {
    relMap.set(objectId, []);
  }
  relMap.get(objectId)!.push(termTaxonomyId);
}

function splitSqlValues(str: string): string[] {
  const result: string[] = [];
  let current = "";
  let inString = false;
  let escaped = false;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      current += char;
      continue;
    }

    if (char === "'" && !escaped) {
      inString = !inString;
      current += char;
      continue;
    }

    if (char === "," && !inString) {
      result.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }
  result.push(current.trim());
  return result;
}
