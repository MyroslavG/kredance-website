import fs from "node:fs";
import path from "node:path";

const outputDirectory = path.resolve("out");
const siteOrigin = "https://www.kredance.com";
const errors = [];

function decodeHtml(value) {
  return value.replace(
    /&(#x?[0-9a-f]+|amp|quot|apos|lt|gt);/gi,
    (entity, code) => {
      const named = {
        amp: "&",
        quot: '"',
        apos: "'",
        lt: "<",
        gt: ">",
      };

      if (code[0] !== "#") return named[code.toLowerCase()] ?? entity;
      const hexadecimal = code[1].toLowerCase() === "x";
      const number = Number.parseInt(code.slice(hexadecimal ? 2 : 1), hexadecimal ? 16 : 10);
      return Number.isNaN(number) ? entity : String.fromCodePoint(number);
    },
  );
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`, "i"));
  return match ? decodeHtml(match[1] ?? match[2]) : undefined;
}

function normalizePathname(pathname) {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "") || "/";
}

function routeFromFile(file) {
  const relative = path.relative(outputDirectory, file).split(path.sep).join("/");
  return relative === "index.html" ? "/" : `/${relative.slice(0, -".html".length)}`;
}

function collectHtmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectHtmlFiles(target);
    if (!entry.name.endsWith(".html")) return [];
    if (["404.html", "_not-found.html"].includes(entry.name)) return [];
    return [target];
  });
}

function findTag(html, tagName, attributeName, attributeValue) {
  const tags = html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) ?? [];
  return tags.find((tag) => attribute(tag, attributeName)?.toLowerCase() === attributeValue);
}

function schemasFrom(value) {
  if (Array.isArray(value)) return value.flatMap(schemasFrom);
  if (!value || typeof value !== "object") return [];
  const nested = "@graph" in value ? schemasFrom(value["@graph"]) : [];
  return [value, ...nested];
}

function outputAssetExists(pathname) {
  const relative = pathname.replace(/^\//, "");
  return relative !== "" && fs.existsSync(path.join(outputDirectory, relative));
}

if (!fs.existsSync(outputDirectory)) {
  console.error("SEO check failed: out/ does not exist. Run `npm run build` first.");
  process.exit(1);
}

const htmlFiles = collectHtmlFiles(outputDirectory);
const pages = htmlFiles.map((file) => ({
  file,
  route: routeFromFile(file),
  html: fs.readFileSync(file, "utf8"),
}));
const routes = new Set(pages.map(({ route }) => normalizePathname(route)));
const titles = new Map();
const descriptions = new Map();

for (const page of pages) {
  const title = decodeHtml(page.html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "");
  const descriptionTag = findTag(page.html, "meta", "name", "description");
  const description = descriptionTag ? attribute(descriptionTag, "content")?.trim() ?? "" : "";

  if (!title) errors.push(`${page.route}: missing <title>`);
  if (!description) errors.push(`${page.route}: missing meta description`);

  if (title) {
    const duplicate = titles.get(title);
    if (duplicate) errors.push(`${page.route}: title duplicates ${duplicate}: "${title}"`);
    else titles.set(title, page.route);
  }

  if (description) {
    const duplicate = descriptions.get(description);
    if (duplicate) errors.push(`${page.route}: description duplicates ${duplicate}`);
    else descriptions.set(description, page.route);
  }

  const canonicalTag = findTag(page.html, "link", "rel", "canonical");
  const canonicalValue = canonicalTag ? attribute(canonicalTag, "href") : undefined;
  if (!canonicalValue) {
    errors.push(`${page.route}: missing canonical URL`);
  } else {
    try {
      const canonical = new URL(canonicalValue);
      const expectedPath = normalizePathname(page.route);
      if (canonical.protocol !== "https:") errors.push(`${page.route}: canonical must use HTTPS`);
      if (canonical.origin !== siteOrigin) errors.push(`${page.route}: canonical uses unexpected origin ${canonical.origin}`);
      if (normalizePathname(canonical.pathname) !== expectedPath) {
        errors.push(`${page.route}: canonical path ${canonical.pathname} does not match route`);
      }
      if (canonical.search || canonical.hash) errors.push(`${page.route}: canonical contains a query or fragment`);
    } catch {
      errors.push(`${page.route}: invalid canonical URL "${canonicalValue}"`);
    }
  }

  for (const imageTag of page.html.match(/<img\b[^>]*>/gi) ?? []) {
    const alt = attribute(imageTag, "alt");
    const source = attribute(imageTag, "src") ?? "unknown source";
    if (alt === undefined) errors.push(`${page.route}: image is missing alt attribute (${source})`);
  }

  for (const anchorTag of page.html.match(/<a\b[^>]*>/gi) ?? []) {
    const href = attribute(anchorTag, "href");
    if (!href || /^(mailto:|tel:|javascript:)/i.test(href)) continue;

    let target;
    try {
      target = new URL(href, `${siteOrigin}${page.route}`);
    } catch {
      errors.push(`${page.route}: invalid link URL "${href}"`);
      continue;
    }

    if (target.origin !== siteOrigin) continue;
    const targetPath = normalizePathname(target.pathname);
    if (!routes.has(targetPath) && !outputAssetExists(target.pathname)) {
      errors.push(`${page.route}: broken internal link "${href}"`);
      continue;
    }

    if (target.hash && routes.has(targetPath)) {
      const targetPage = pages.find(({ route }) => normalizePathname(route) === targetPath);
      const identifier = decodeURIComponent(target.hash.slice(1));
      const escaped = identifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (targetPage && !new RegExp(`\\s(?:id|name)=["']${escaped}["']`, "i").test(targetPage.html)) {
        errors.push(`${page.route}: link fragment does not exist "${href}"`);
      }
    }
  }

  const jsonLdTags = (page.html.match(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) ?? []);
  if (jsonLdTags.length === 0) errors.push(`${page.route}: no JSON-LD structured data found`);

  for (const scriptTag of jsonLdTags) {
    const rawJson = scriptTag.replace(/^<script\b[^>]*>/i, "").replace(/<\/script>$/i, "");
    try {
      const parsed = JSON.parse(rawJson);
      for (const schema of schemasFrom(parsed)) {
        if (schema["@context"] && schema["@context"] !== "https://schema.org") {
          errors.push(`${page.route}: structured data uses invalid @context`);
        }
        if (!schema["@type"]) errors.push(`${page.route}: structured data object is missing @type`);

        if (schema["@type"] === "BreadcrumbList") {
          const items = schema.itemListElement;
          if (!Array.isArray(items) || items.length < 2) {
            errors.push(`${page.route}: BreadcrumbList must contain at least two items`);
          } else {
            items.forEach((item, index) => {
              if (item.position !== index + 1) errors.push(`${page.route}: breadcrumb positions are not sequential`);
              try {
                if (new URL(item.item).origin !== siteOrigin) errors.push(`${page.route}: breadcrumb item is not internal`);
              } catch {
                errors.push(`${page.route}: breadcrumb item has an invalid URL`);
              }
            });
          }
        }
      }
    } catch (error) {
      errors.push(`${page.route}: JSON-LD does not parse (${error.message})`);
    }
  }
}

const sitemapPath = path.join(outputDirectory, "sitemap.xml");
if (!fs.existsSync(sitemapPath)) {
  errors.push("sitemap.xml: file is missing");
} else {
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  if (!/^<\?xml[\s\S]*<urlset\b[\s\S]*<\/urlset>\s*$/i.test(sitemap)) {
    errors.push("sitemap.xml: invalid urlset document");
  }
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((match) => decodeHtml(match[1]));
  const sitemapRoutes = new Set();
  for (const location of locations) {
    try {
      const url = new URL(location);
      if (url.origin !== siteOrigin) errors.push(`sitemap.xml: unexpected origin in ${location}`);
      sitemapRoutes.add(normalizePathname(url.pathname));
    } catch {
      errors.push(`sitemap.xml: invalid URL ${location}`);
    }
  }
  if (locations.length !== sitemapRoutes.size) errors.push("sitemap.xml: contains duplicate URLs");
  for (const route of routes) {
    if (!sitemapRoutes.has(route)) errors.push(`sitemap.xml: missing route ${route}`);
  }
  for (const route of sitemapRoutes) {
    if (!routes.has(route)) errors.push(`sitemap.xml: URL has no exported page ${route}`);
  }
}

const robotsPath = path.join(outputDirectory, "robots.txt");
if (!fs.existsSync(robotsPath)) {
  errors.push("robots.txt: file is missing");
} else {
  const robots = fs.readFileSync(robotsPath, "utf8");
  if (!/^User-Agent:\s*\*/im.test(robots)) errors.push("robots.txt: missing wildcard User-Agent rule");
  const sitemapDirective = robots.match(/^Sitemap:\s*(\S+)\s*$/im)?.[1];
  if (sitemapDirective !== `${siteOrigin}/sitemap.xml`) {
    errors.push("robots.txt: sitemap directive is missing or invalid");
  }
}

if (errors.length > 0) {
  console.error(`SEO validation failed with ${errors.length} error${errors.length === 1 ? "" : "s"}:`);
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}

console.log(`SEO validation passed for ${pages.length} pages.`);
console.log("Checked unique metadata, canonicals, image alt text, internal links, discovery files, and JSON-LD.");
