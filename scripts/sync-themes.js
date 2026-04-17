/**
 * sync-themes: theme-common.cssの共通レイアウトCSSを全テーマファイルに反映する
 *
 * 各テーマファイルの構造:
 *   1. テーマ宣言 + @import 'default' + ヘッダーコメント
 *   2. :root { 色変数 }
 *   3. セパレータコメント
 *   4. 共通レイアウトCSS ← ここをtheme-common.cssから上書き
 */

const fs = require('fs');
const path = require('path');

const THEMES_DIR = path.join(__dirname, '..', 'themes');
const COMMON_FILE = path.join(THEMES_DIR, 'theme-common.css');
const THEME_FILES = ['theme-toughness.css', 'theme-wisdom.css', 'theme-with_you.css'];

const SEPARATOR = `
/* ========================================
   以下は共通スタイル（theme-common.cssより）
   ======================================== */
`;

// theme-common.cssから共通CSS部分を抽出（@themeと@importの後のCSS本体）
const extractCommonCSS = (content) => {
  // "/* ===== 基本スタイル =====" の直前から取得
  const marker = '/* ===== 基本スタイル =====';
  const idx = content.indexOf(marker);
  if (idx === -1) {
    throw new Error('theme-common.css内に基本スタイルのマーカーが見つかりません');
  }
  return '\n' + content.slice(idx);
};

// テーマファイルからヘッダー部（:rootブロック末尾まで）を抽出
const extractThemeHeader = (content) => {
  // :root { ... } の閉じ括弧を探す
  const rootStart = content.indexOf(':root {');
  if (rootStart === -1) {
    throw new Error(':rootブロックが見つかりません');
  }

  let depth = 0;
  let rootEnd = -1;
  for (let i = rootStart; i < content.length; i++) {
    if (content[i] === '{') depth++;
    if (content[i] === '}') {
      depth--;
      if (depth === 0) {
        rootEnd = i + 1;
        break;
      }
    }
  }

  if (rootEnd === -1) {
    throw new Error(':rootブロックの閉じ括弧が見つかりません');
  }

  return content.slice(0, rootEnd);
};

// メイン処理
const commonContent = fs.readFileSync(COMMON_FILE, 'utf-8');
const commonCSS = extractCommonCSS(commonContent);

let updated = 0;
for (const file of THEME_FILES) {
  const filePath = path.join(THEMES_DIR, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const header = extractThemeHeader(content);
  const newContent = header + SEPARATOR + commonCSS;

  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`updated: ${file}`);
  updated++;
}

console.log(`\n${updated} theme files synced from theme-common.css`);
