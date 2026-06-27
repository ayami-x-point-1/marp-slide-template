/**
 * archive-slides: slides/内の完成スライドを lt-archives リポジトリへアーカイブする
 *
 * 使い方:
 *   npm run archive -- YYYY-MM-DD      （イベント日を必ず指定する）
 *
 * 対象: slides/*.md（.gitkeep を除く。source.md は本体talkフォルダへ同梱）
 * 出力先: ../lt-archives/{イベント日}_{ファイル名}/
 *   - スライド.md / source.md … slides/ から「移動」
 *   - HTML・PDF … dist/{名前}/ から「コピー」（dist は変更しない）
 *   - 参照ローカルアセット（画像・mp4）… slides/ から「コピー」して同梱（slides は変更しない）
 * さらに: 参照mp4は ../slide-assets/{イベント日}_{名前}/ にもコピー（GitHub Pages配信用）
 *
 * 破壊的操作は slides/ の .md 移動のみ。dist/ と slides/ のアセットは保持する。
 */

const fs = require('fs');
const path = require('path');

const SLIDES_DIR = path.join(__dirname, '..', 'slides');
const DIST_DIR = path.join(__dirname, '..', 'dist');
// lt-archives / slide-assets は marp-slide-template と同階層（LT/配下）の独立リポジトリ
const ARCHIVE_DIR = path.join(__dirname, '..', '..', 'lt-archives');
const SLIDE_ASSETS_DIR = path.join(__dirname, '..', '..', 'slide-assets');

const EXCLUDE = new Set(['.gitkeep']);
const SOURCE_FILE = 'source.md';

// イベント日は引数で必須指定（実行日ではない）
const eventDate = process.argv.slice(2).find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a));
if (!eventDate) {
  console.error('イベント日を指定してください: npm run archive -- YYYY-MM-DD');
  process.exit(1);
}

// アーカイブ先リポジトリが無ければ中断
if (!fs.existsSync(ARCHIVE_DIR)) {
  console.error(`アーカイブ先がありません: ${ARCHIVE_DIR}`);
  console.error(`lt-archives リポジトリを ${path.dirname(ARCHIVE_DIR)} に clone してください。`);
  process.exit(1);
}

// mdが参照するローカルアセットの絶対パス一覧を返す（リモート・データURIは除外）
const collectAssetRefs = (mdContent) => {
  const refs = new Set();
  const patterns = [
    /src\s*=\s*["']([^"']+)["']/g, // <img src="...">, <video src="...">
    /!\[[^\]]*\]\(([^)\s]+)/g, // ![alt](path)
    /url\(\s*["']?([^"')]+)["']?\s*\)/g, // CSS url(...)
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(mdContent)) !== null) refs.add(m[1]);
  }
  return [...refs]
    .filter((ref) => !/^(https?:)?\/\//.test(ref) && !ref.startsWith('data:'))
    .map((ref) => path.resolve(SLIDES_DIR, ref))
    .filter((p) => p.startsWith(SLIDES_DIR) && fs.existsSync(p));
};

// 本体スライド（source.md と .gitkeep を除く .md）
const mainFiles = fs
  .readdirSync(SLIDES_DIR)
  .filter((f) => f.endsWith('.md') && !EXCLUDE.has(f) && f !== SOURCE_FILE);

if (mainFiles.length === 0) {
  console.log('slides/にアーカイブ対象のスライドがありません');
  process.exit(0);
}

let sourceTarget = null; // source.md を入れる本体フォルダ（最新mtimeの本体を選ぶ）
let sourceTargetName = null;
let sourceTargetMtime = -1;
let movedCount = 0;

for (const file of mainFiles) {
  const baseName = path.basename(file, '.md');
  const srcMdPath = path.join(SLIDES_DIR, file);
  const mdContent = fs.readFileSync(srcMdPath, 'utf8');
  const mtime = fs.statSync(srcMdPath).mtimeMs;

  // 出力フォルダ名（同名があれば連番）
  const archiveBase = path.join(ARCHIVE_DIR, `${eventDate}_${baseName}`);
  let finalDir = archiveBase;
  let suffix = 2;
  while (fs.existsSync(finalDir)) {
    finalDir = `${archiveBase}_${suffix}`;
    suffix++;
  }
  const finalName = path.basename(finalDir);
  fs.mkdirSync(finalDir, { recursive: true });

  // スライド.md を移動（slides/ から取り除く）
  fs.renameSync(srcMdPath, path.join(finalDir, file));
  console.log(`  slides/${file} → lt-archives/${finalName}/${file} (移動)`);

  // dist/{baseName}/ の HTML・PDF を「コピー」（dist は保持）
  const distSubDir = path.join(DIST_DIR, baseName);
  for (const ext of ['.html', '.pdf']) {
    const distPath = path.join(distSubDir, baseName + ext);
    if (fs.existsSync(distPath)) {
      fs.copyFileSync(distPath, path.join(finalDir, baseName + ext));
      console.log(`  dist/${baseName}/${baseName}${ext} → lt-archives/${finalName}/${baseName}${ext} (コピー)`);
    }
  }

  // 参照アセットを「コピー」して同梱（slides は保持）。mp4は slide-assets にもコピー
  for (const srcAsset of collectAssetRefs(mdContent)) {
    const rel = path.relative(SLIDES_DIR, srcAsset);
    const dest = path.join(finalDir, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(srcAsset, dest);
    console.log(`  slides/${rel} → lt-archives/${finalName}/${rel} (コピー)`);

    if (srcAsset.endsWith('.mp4')) {
      if (fs.existsSync(SLIDE_ASSETS_DIR)) {
        const saDir = path.join(SLIDE_ASSETS_DIR, finalName);
        fs.mkdirSync(saDir, { recursive: true });
        fs.copyFileSync(srcAsset, path.join(saDir, path.basename(srcAsset)));
        console.log(`  slides/${rel} → slide-assets/${finalName}/${path.basename(rel)} (コピー)`);
      } else {
        console.warn(`  ⚠ slide-assets が無いため mp4 を配信用にコピーできません: ${rel}`);
      }
    }
  }

  // source.md の同梱先は最新mtimeの本体フォルダにする
  if (mtime > sourceTargetMtime) {
    sourceTargetMtime = mtime;
    sourceTarget = finalDir;
    sourceTargetName = finalName;
  }
  movedCount++;
}

// source.md を本体フォルダへ移動（思考の軌跡として保存）
const sourcePath = path.join(SLIDES_DIR, SOURCE_FILE);
if (fs.existsSync(sourcePath) && sourceTarget) {
  fs.renameSync(sourcePath, path.join(sourceTarget, SOURCE_FILE));
  console.log(`  slides/${SOURCE_FILE} → lt-archives/${sourceTargetName}/${SOURCE_FILE} (移動)`);
}

console.log(`\n✓ ${movedCount}個のスライドを lt-archives にアーカイブしました（イベント日: ${eventDate}）`);
