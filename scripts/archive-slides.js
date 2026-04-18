/**
 * archive-slides: slides/内の完成スライドをarchive/に移動する
 *
 * 対象: slides/*.md（source.md と .gitkeep を除く）
 * 出力先: archive/{YYYY-MM-DD}_{ファイル名}/
 * dist/内の対応するHTML/PDFも一緒に移動
 */

const fs = require('fs');
const path = require('path');

const SLIDES_DIR = path.join(__dirname, '..', 'slides');
const ARCHIVE_DIR = path.join(__dirname, '..', 'archive');
const DIST_DIR = path.join(__dirname, '..', 'dist');

const EXCLUDE = new Set(['.gitkeep']);

const today = new Date().toISOString().slice(0, 10);

const files = fs.readdirSync(SLIDES_DIR)
  .filter(f => f.endsWith('.md') && !EXCLUDE.has(f));

if (files.length === 0) {
  console.log('slides/にアーカイブ対象のファイルがありません');
  process.exit(0);
}

let movedCount = 0;

for (const file of files) {
  const baseName = path.basename(file, '.md');
  const archiveName = `${today}_${baseName}`;
  const archiveDir = path.join(ARCHIVE_DIR, archiveName);

  // 同名ディレクトリが既に存在する場合は連番を付与
  let finalDir = archiveDir;
  let suffix = 2;
  while (fs.existsSync(finalDir)) {
    finalDir = `${archiveDir}_${suffix}`;
    suffix++;
  }
  const finalName = path.basename(finalDir);

  fs.mkdirSync(finalDir, { recursive: true });

  // スライド.mdを移動
  fs.renameSync(
    path.join(SLIDES_DIR, file),
    path.join(finalDir, file)
  );
  console.log(`  slides/${file} → archive/${finalName}/${file}`);

  // dist/内の対応ファイル（HTML/PDF）を移動
  for (const ext of ['.html', '.pdf']) {
    const distFile = baseName + ext;
    const distPath = path.join(DIST_DIR, distFile);
    if (fs.existsSync(distPath)) {
      fs.renameSync(distPath, path.join(finalDir, distFile));
      console.log(`  dist/${distFile} → archive/${finalName}/${distFile}`);
    }
  }

  movedCount++;
}

console.log(`\n✓ ${movedCount}個のスライドをアーカイブしました`);
