// Lists the Tailwind classes in src/ that Tailwind would write another way, e.g. `w-[16px]` for `w-4`,
// and fails if there are any. The same suggestions the Tailwind editor extension makes, for every file at once.
// Uses Tailwind's unstable design system API, which Prettier's Tailwind plugin relies on too.
import fs from 'node:fs';
import path from 'node:path';

import { __unstable__loadDesignSystem } from '@tailwindcss/node';
import { Scanner } from '@tailwindcss/oxide';

const root = path.resolve(import.meta.dirname, '..');
const css = path.join(root, 'src/app/globals.css');

const designSystem = await __unstable__loadDesignSystem(fs.readFileSync(css, 'utf8'), { base: path.dirname(css) });
const scanner = new Scanner({});

const files = fs
  .readdirSync(path.join(root, 'src'), { recursive: true })
  .filter((file) => /\.(tsx?|css)$/.test(file))
  .map((file) => path.join(root, 'src', file));

let found = 0;
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  for (const { candidate, position } of scanner.getCandidatesWithPositions({ content, extension: path.extname(file).slice(1) })) {
    // Words that aren't Tailwind classes at all
    if (designSystem.candidatesToCss([candidate])[0] == null) continue;

    const [canonical] = designSystem.canonicalizeCandidates([candidate], { rem: 16 });
    if (canonical && canonical !== candidate) {
      const line = content.slice(0, position).split('\n').length;
      console.log(`${path.relative(root, file)}:${line}  ${candidate}  ->  ${canonical}`);
      found++;
    }
  }
}

if (found) {
  console.error(`\n${found} ${found === 1 ? 'class' : 'classes'} Tailwind would write another way, in ${files.length} files.`);
  process.exit(1);
}
console.log(`No classes to change, in ${files.length} files.`);
