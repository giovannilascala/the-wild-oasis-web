// Costruisce la dispensa: src/*.md -> build/dispensa.html -> Dispensa_Matematica_Generale_30062.pdf
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import container from "markdown-it-container";
import mdKatex from "@vscode/markdown-it-katex";
import { chromium } from "playwright-core";

const root = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(root, "src");
const buildDir = path.join(root, "build");
const pdfPath = path.join(root, "Dispensa_Matematica_Generale_30062.pdf");

const slug = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const md = new MarkdownIt({ html: true, typographer: true })
  .use(mdKatex.default ?? mdKatex, { throwOnError: true, macros: { "\\R": "\\mathbb{R}", "\\N": "\\mathbb{N}" } })
  .use(anchor, { slugify: slug, level: [1, 2, 3] });

// Riquadri: ::: teoria Titolo / ::: metodo / ::: trappola / ::: esercizio Fonte / ::: soluzione / ::: nota
const boxes = { teoria: "Teoria", metodo: "Metodo", trappola: "Trappola", esercizio: "Esercizio", soluzione: "Soluzione", nota: "Nota" };
for (const [name, label] of Object.entries(boxes)) {
  md.use(container, name, {
    render(tokens, idx) {
      const t = tokens[idx];
      if (t.nesting === 1) {
        const title = t.info.trim().slice(name.length).trim();
        const head = title ? `${label} — ${md.renderInline(title)}` : label;
        return `<div class="box ${name}"><div class="box-title">${head}</div>\n`;
      }
      return "</div>\n";
    },
  });
}

const files = fs.readdirSync(srcDir).filter((f) => f.endsWith(".md")).sort();
const body = files.map((f) => {
  const html = md.render(fs.readFileSync(path.join(srcDir, f), "utf8"));
  return `<section class="chapter" id="file-${slug(f)}">${html}</section>`;
}).join("\n");

// Indice generato dagli h1/h2
const toc = [];
body.replace(/<h([12]) id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g, (_, lvl, id, inner) => {
  if (id !== "copertina") toc.push({ lvl: +lvl, id, text: inner.replace(/<[^>]+>/g, "") });
});
const tocHtml = `<nav class="toc"><h1 class="toc-title">Indice</h1><ol>${toc
  .map((e) => `<li class="l${e.lvl}"><a href="#${e.id}">${e.text}</a></li>`)
  .join("")}</ol></nav>`;

const katexCss = pathToFileURL(path.join(root, "node_modules/katex/dist/katex.min.css")).href;
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const html = `<!doctype html><html lang="it"><head><meta charset="utf-8">
<title>Matematica Generale 30062 — Dispensa d'esame</title>
<link rel="stylesheet" href="${katexCss}"><style>${css}</style></head>
<body>${body.replace("<!--TOC-->", tocHtml)}</body></html>`;

fs.mkdirSync(buildDir, { recursive: true });
const htmlPath = path.join(buildDir, "dispensa.html");
fs.writeFileSync(htmlPath, html);

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage();
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
await page.pdf({
  path: pdfPath,
  format: "A4",
  printBackground: true,
  displayHeaderFooter: true,
  margin: { top: "18mm", bottom: "18mm", left: "17mm", right: "17mm" },
  headerTemplate: `<div style="font-size:7.5px;width:100%;padding:0 17mm;color:#777;font-family:Georgia,serif;display:flex;justify-content:space-between"><span>Matematica Generale 30062 — Dispensa d'esame</span><span>Bocconi · CLEAM · A.A. 2026/27</span></div>`,
  footerTemplate: `<div style="font-size:8px;width:100%;text-align:center;color:#777;font-family:Georgia,serif"><span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
});
await browser.close();
console.log(`OK: ${path.relative(root, pdfPath)} da ${files.length} file sorgente`);
