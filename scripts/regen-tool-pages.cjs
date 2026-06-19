/*
 * Regenerate all tool .astro pages to use the v2 ToolLayout.
 * One-shot script — not committed runtime code.
 *
 * Reads each existing tool page, extracts:
 *   - the slug (from filename)
 *   - the React component name (from the bottom <script> import)
 *   - the article body (from the existing prose <article>) when present
 *   - the FAQ array (from the existing `const faqs = [...]`)
 *   - title + description (from <BaseLayout> or hard-coded fallbacks)
 * and rewrites the page in the new manuscript style.
 *
 * Usage: node scripts/regen-tool-pages.cjs
 */
const fs = require('node:fs')
const path = require('node:path')

const DIR = path.resolve(__dirname, '..', 'src', 'pages', 'tools')
const TOOLS_DATA = path.resolve(__dirname, '..', 'src', 'data', 'tools.ts')

// Read the canonical tool list to get name/desc.
const toolsSrc = fs.readFileSync(TOOLS_DATA, 'utf8')
const toolMatches = [...toolsSrc.matchAll(/\{\s*slug: "([^"]+)",\s*name: "([^"]+)",\s*description: "([^"]+)"/g)]
const TOOL_BY_SLUG = Object.fromEntries(toolMatches.map((m) => [m[1], { slug: m[1], name: m[2], description: m[3] }]))

// File-stem → React component module name. Derived from existing imports.
const COMPONENT_BY_SLUG = {
  'add-page-numbers': 'AddPageNumbers',
  'add-watermark': 'AddWatermark',
  'ai-summarizer': 'AISummarizer',
  'compare-pdf': 'ComparePDF',
  'compress-pdf': 'CompressPDF',
  'crop-pdf': 'CropPDF',
  'excel-to-pdf': 'ExcelToPDF',
  'extract-pages': 'ExtractPages',
  'html-to-pdf': 'HTMLtoPDF',
  'jpg-to-pdf': 'JPGtoPDF',
  'merge-pdf': 'MergePDF',
  'ocr-pdf': 'OCRPDF',
  'optimize-pdf': 'OptimizePDF',
  'organize-pdf': 'OrganizePDF',
  'pdf-to-excel': 'PDFToExcel',
  'pdf-to-jpg': 'PDFtoJPG',
  'pdf-to-pdfa': 'PDFToPDFA',
  'pdf-to-powerpoint': 'PDFToPowerPoint',
  'pdf-to-word': 'PDFToWord',
  'powerpoint-to-pdf': 'PowerPointToPDF',
  'protect-pdf': 'ProtectPDF',
  'redact-pdf': 'RedactPDF',
  'remove-pages': 'RemovePages',
  'repair-pdf': 'RepairPDF',
  'rotate-pdf': 'RotatePDF',
  'scan-to-pdf': 'ScanToPDF',
  'sign-pdf': 'SignPDF',
  'split-pdf': 'SplitPDF',
  'unlock-pdf': 'UnlockPDF',
  'word-to-pdf': 'WordtoPDF',
}

function existingFaqs(text) {
  // Pull the existing const faqs = [{...}] array literal verbatim.
  const m = text.match(/const faqs[^=]*=\s*(\[[\s\S]*?\]);/)
  if (!m) return null
  return m[1]
}

function existingTitle(text) {
  const m = text.match(/title:\s*"([^"]+)"|title=\{?"([^"]+)"\}?/)
  if (!m) return null
  return (m[1] ?? m[2]).replace(/\s*\|\s*OrizPDF\b/, '')
}

function existingDescription(text) {
  const m = text.match(/description=\{?"([^"]+)"\}?/)
  if (!m) return null
  return m[1]
}

function articleBody(text) {
  // Inline articles in this codebase are either:
  //   <article ...>{set:html=articleContent}</article>
  // or:
  //   <article class="..."><h2>...</h2><p>...</p>...</article>
  // We extract the inner HTML from the second form, returning null otherwise.
  const m = text.match(/<article[^>]*prose[^>]*>([\s\S]*?)<\/article>/)
  if (!m) return null
  let inner = m[1].trim()
  // Drop the outer set:html bridges.
  inner = inner.replace(/\{?\s*set:html=\{?articleContent\}?\}?\s*\/?>?/g, '')
  if (inner.length < 30) return null
  return inner
}

function faqsBlock(slug, name) {
  // Generic 5-item FAQ skeleton when the existing page doesn't have one.
  return `[
\t{ question: "Are my files uploaded anywhere?", answer: "No. Every implement on this desk runs entirely in your browser — \`pdf-lib\`, \`pdfjs-dist\`, and friends operate on the file in memory. Nothing is sent to a server." },
\t{ question: "What is the maximum file size?", answer: "100 MB per leaf. Browser memory is the only ceiling, and most documents sit comfortably below it." },
\t{ question: "Does ${name} work offline?", answer: "Once the page loads, yes. The implements run as JavaScript in your browser; you can disconnect the network and the tool keeps working." },
\t{ question: "Is ${name} free?", answer: "Yes, free and open source under MIT. There is no signup, no paywall, and no upload limit on processing time." },
\t{ question: "Can I trust the result?", answer: "The full source is on GitHub. Test with a non-critical leaf first — that holds for any document tool, mine or otherwise." },
]`
}

const FAQ_OUT = path.resolve(__dirname, '..', 'src', 'data', 'tool-faqs.ts')
const PROSE_OUT = path.resolve(__dirname, '..', 'src', 'data', 'tool-prose.ts')

const faqsBySlug = {}
const proseBySlug = {}

for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith('.astro'))) {
  const slug = path.basename(file, '.astro')
  const tool = TOOL_BY_SLUG[slug]
  if (!tool) {
    console.warn(`[skip] ${slug} — no entry in tools data`)
    continue
  }
  const compName = COMPONENT_BY_SLUG[slug]
  if (!compName) {
    console.warn(`[skip] ${slug} — no component mapping`)
    continue
  }
  const filePath = path.join(DIR, file)
  const text = fs.readFileSync(filePath, 'utf8')

  const titleStr =
    existingTitle(text) ??
    `${tool.name} — free, on-device | oriz / pdf-tools`
  const descStr = existingDescription(text) ?? tool.description
  const faqs = existingFaqs(text) ?? faqsBlock(slug, tool.name)
  const prose = articleBody(text)

  faqsBySlug[slug] = faqs
  proseBySlug[slug] = prose

  // Write the rewritten .astro file.
  const out = `---
import ToolLayout from "~/layouts/ToolLayout.astro";
import { TOOL_FAQS } from "~/data/tool-faqs";
import { TOOL_PROSE } from "~/data/tool-prose";

const slug = ${JSON.stringify(slug)};
const title = ${JSON.stringify(titleStr)};
const description = ${JSON.stringify(descStr)};
const faqs = TOOL_FAQS[slug] ?? [];
const proseHTML = TOOL_PROSE[slug] ?? "";
---

<ToolLayout slug={slug} title={title} description={description} faqs={faqs}>
\t<Fragment set:html={proseHTML} />
</ToolLayout>

<script>
\timport { createElement } from "react";
\timport { createRoot } from "react-dom/client";
\timport ${compName} from "../../tools/${compName}";
\tconst m = document.getElementById("tool-mount");
\tif (m) createRoot(m).render(createElement(${compName}));
</script>
`
  fs.writeFileSync(filePath, out)
  console.log(`[regen] ${slug}`)
}

// Emit the data modules.
const faqsOut =
  '/* Auto-generated by scripts/regen-tool-pages.cjs — edit faq objects in source. */\n' +
  'export interface FAQItem { question: string; answer: string }\n' +
  'export const TOOL_FAQS: Record<string, FAQItem[]> = {\n' +
  Object.entries(faqsBySlug)
    .map(([slug, body]) => `\t${JSON.stringify(slug)}: ${body},`)
    .join('\n') +
  '\n};\n'
fs.writeFileSync(FAQ_OUT, faqsOut)

const proseOut =
  '/* Auto-generated by scripts/regen-tool-pages.cjs — edit copy in source pages. */\n' +
  'export const TOOL_PROSE: Record<string, string> = {\n' +
  Object.entries(proseBySlug)
    .map(([slug, body]) => {
      const safe = (body ?? '')
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\$\{/g, '\\${')
      return `\t${JSON.stringify(slug)}: \`${safe}\`,`
    })
    .join('\n') +
  '\n};\n'
fs.writeFileSync(PROSE_OUT, proseOut)

console.log('done.')
