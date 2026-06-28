/**
 * build-slides: slides/内のMarpスライドをdist/{スライド名}/にビルドする
 *
 * 使い方:
 *   node scripts/build-slides.js          最新ファイルをHTML出力
 *   node scripts/build-slides.js --pdf    最新ファイルをPDF出力
 *   node scripts/build-slides.js --all    全ファイルをHTML出力
 *   node scripts/build-slides.js --watch  最新ファイルを監視して自動リビルド
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const SLIDES_DIR = path.join(__dirname, '..', 'slides');
const DIST_DIR = path.join(__dirname, '..', 'dist');

const args = new Set(process.argv.slice(2));
const isPdf = args.has('--pdf');
const isAll = args.has('--all');
const isWatch = args.has('--watch');

// slides/内の.mdファイルを更新日時の降順で取得
const getSlideFiles = () =>
  fs.readdirSync(SLIDES_DIR)
    .filter(f => f.endsWith('.md') && f !== '.gitkeep')
    .map(f => ({
      name: f,
      mtime: fs.statSync(path.join(SLIDES_DIR, f)).mtimeMs,
    }))
    .sort((a, b) => b.mtime - a.mtime)
    .map(f => f.name);

// Markdownが参照するローカル画像を出力フォルダにコピーする
// HTML出力は相対パス(./xxx.png)をそのまま残すため、出力先に画像が無いと
// ブラウザで開いたときリンク切れになる。dist/{名前}/を自己完結させる。
const copyAssets = (file, outDir) => {
  const raw = fs.readFileSync(path.join(SLIDES_DIR, file), 'utf8');
  const refs = new Set();
  const patterns = [
    /src\s*=\s*["']([^"']+)["']/g, // <img src="...">
    /!\[[^\]]*\]\(([^)\s]+)/g, // ![alt](path)
    /url\(\s*["']?([^"')]+)["']?\s*\)/g, // CSS url(...)
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(raw)) !== null) refs.add(m[1]);
  }
  for (const ref of refs) {
    // リモートURL・データURIはコピー不要
    if (/^(https?:)?\/\//.test(ref) || ref.startsWith('data:')) continue;
    const srcImg = path.resolve(SLIDES_DIR, ref);
    // slides/配下の実在ファイルのみ対象
    if (!srcImg.startsWith(SLIDES_DIR) || !fs.existsSync(srcImg)) continue;
    const destImg = path.join(outDir, path.relative(SLIDES_DIR, srcImg));
    fs.mkdirSync(path.dirname(destImg), { recursive: true });
    fs.copyFileSync(srcImg, destImg);
  }
};

// 1ファイルをビルド
const buildFile = (file, { pdf = false } = {}) => {
  const baseName = path.basename(file, '.md');
  const ext = pdf ? '.pdf' : '.html';
  const outDir = path.join(DIST_DIR, baseName);
  const outPath = path.join(outDir, baseName + ext);

  fs.mkdirSync(outDir, { recursive: true });
  copyAssets(file, outDir);

  // PDF/PNG出力はヘッドレスブラウザでレンダリングするため、
  // ローカル画像(./xxx.png)の読み込みに --allow-local-files が必須
  const pdfFlag = pdf ? ' --pdf --allow-local-files' : '';
  execSync(`marp "${path.join(SLIDES_DIR, file)}"${pdfFlag} -o "${outPath}"`, {
    stdio: 'inherit',
  });

  console.log(`  → ${path.relative(process.cwd(), outPath)}`);
};

// watchモード（spawn で常駐プロセスとして実行）
const watchFile = (file) => {
  const baseName = path.basename(file, '.md');
  const outDir = path.join(DIST_DIR, baseName);
  const outPath = path.join(outDir, baseName + '.html');

  fs.mkdirSync(outDir, { recursive: true });
  copyAssets(file, outDir);

  const child = spawn(
    'marp',
    [path.join(SLIDES_DIR, file), '-w', '-o', outPath],
    { stdio: 'inherit' }
  );

  // Ctrl+C でクリーンに終了
  process.on('SIGINT', () => child.kill('SIGINT'));
  child.on('exit', (code) => process.exit(code ?? 0));
};

// メイン処理
const files = getSlideFiles();

if (files.length === 0) {
  console.log('slides/にmdファイルがありません');
  process.exit(0);
}

if (isWatch) {
  console.log(`watching: ${files[0]}`);
  watchFile(files[0]);
} else if (isAll) {
  console.log(`building ${files.length} files...`);
  for (const file of files) {
    buildFile(file, { pdf: isPdf });
  }
  console.log(`\n✓ ${files.length}個のスライドをビルドしました`);
} else {
  buildFile(files[0], { pdf: isPdf });
}
