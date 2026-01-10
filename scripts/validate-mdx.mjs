import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const contentDir = path.join(root, "src", "content");

if (!fs.existsSync(contentDir)) {
  console.error(`Missing content directory: ${contentDir}`);
  process.exit(1);
}

const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));
let failures = 0;

for (const file of files) {
  const fullPath = path.join(contentDir, file);
  const raw = fs.readFileSync(fullPath, "utf8");
  try {
    matter(raw);
  } catch (e) {
    failures++;
    console.error(`\n[FAIL] ${file}`);
    console.error(String(e?.message ?? e));
  }
}

if (failures) {
  console.error(`\n${failures} MDX file(s) have invalid frontmatter.`);
  process.exit(1);
}

console.log(`OK: ${files.length} MDX file(s) parsed successfully.`);


