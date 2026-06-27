# Marp Templates プロジェクト

Marp（Markdown Presentation Ecosystem）を使用したプレゼンテーションテンプレート集。

## プロジェクト構造

```
marp-templates/
├── themes/                    # CSSテーマ（自己完結型）
│   ├── theme-common.css       # 共通レイアウトの原本（編集起点）
│   ├── theme-toughness.css    # 色変数 + 共通CSS全体
│   ├── theme-wisdom.css       # 同上
│   └── theme-with_you.css     # 同上
├── samples/                   # テーマ別包括的サンプル
│   ├── sample-toughness.md
│   ├── sample-wisdom.md
│   └── sample-with_you.md
├── slides/                    # 作業ディレクトリ（git除外）
├── archive/                   # 旧アーカイブ（現在は外部の ../lt-archives を使用）
├── dist/                      # ビルド出力（dist/{名前}/ 構成、git除外）
├── scripts/                   # ユーティリティスクリプト
│   ├── build-slides.js        # ビルド（dist/{名前}/に出力）
│   ├── archive-slides.js      # lt-archives へアーカイブ
│   └── sync-themes.js         # テーマ同期
├── .marprc.yml                # Marp CLI共通設定
├── package.json
├── LAYOUTS.md                 # レイアウトパターンガイド
└── README.md
```

## テーマシステム

### 利用可能なテーマ

1. **theme-toughness** - タフ・力強いデザイン（グリーン系グラデーション）
2. **theme-wisdom** - 知的・落ち着いたデザイン（パープル〜ピンク系グラデーション）
3. **theme-with_you** - 親しみやすいデザイン（レッド〜イエロー系グラデーション）

### テーマCSSの構造

Marpの仕様上、カスタムテーマ間の`@import`は動作しない（`@import 'default'`のみ有効）。各テーマは自己完結型。

**各テーマファイルの構成:**
1. `/* @theme theme-{name} */` + `@import 'default'`
2. `:root { ... }` テーマ固有の色変数
3. 共通レイアウトCSS（theme-common.cssと同一内容）

**共通CSSの変更手順:**
1. `themes/theme-common.css` を編集
2. `npm run sync-themes` で全テーマに反映

### テーマの指定方法

```yaml
---
marp: true
theme: theme-wisdom
paginate: true
---
```

## ビルドコマンド

```bash
# slides/内の最新ファイルをHTML出力
npm run build

# slides/内の最新ファイルをPDF出力
npm run build:pdf

# slides/内の全ファイルをビルド
npm run build:all

# ライブプレビュー（ブラウザで確認、自動リロード）
npm run preview

# 最新ファイルを監視して自動リビルド
npm run watch

# サンプル全テーマビルド（テーマ変更確認用）
npm run build:samples

# theme-common.cssの変更を全テーマに反映
npm run sync-themes

# 完成スライドを lt-archives へアーカイブ（イベント日を必ず指定）
# 通常は archiving-slides スキル経由で実行する
npm run archive -- YYYY-MM-DD
```

## ワークフロー

1. `/creating-slides` スキルでスライドを生成（`slides/` に出力）
2. `npm run preview` でブラウザプレビュー
3. 編集 → 自動リロードで確認
4. `npm run build` または `npm run build:pdf` で最終出力

## アーカイブ運用

完成したスライドは **`archiving-slides` スキル**でアーカイブする（`.claude/skills/archiving-slides/`）。

- **保存先**: `lt-archives` リポジトリ（非公開・ワークスペース直下にclone）の `{イベント日}_{名前}/` に md / html / pdf / 参照アセット / 動画を同梱する
- **デモ動画**: `slide-assets` リポジトリ（公開・GitHub Pages配信）の `{イベント日}_{名前}/` にもコピーする
- **実行**: `npm run archive -- <YYYY-MM-DD>`（イベント日を必ず指定。未指定はエラーで停止）。スキル経由なら日付を対話で確定してから実行する
- **破壊的操作は slides/ の `.md` 移動のみ**。`dist/` と slides/ のアセットは保持（コピー）する
- **lt-archives / slide-assets はともに PR運用**（main へ直接 push しない）

詳細手順は `archiving-slides` スキルを参照。

## Marp固有の注意点

### HTMLタグ使用時の重要ルール

**`<div>` タグの前後に空行が必須。**

```markdown
<div class="columns">
<div>

### コンテンツ

</div>
</div>
```

### progress-fill の使用方法

幅指定は **クラス名** で行う。`style` 属性ではない。

```markdown
<div class="progress-bar">
  <div class="progress-fill progress-fill-75">75%</div>
</div>
```

利用可能: `progress-fill-{数値}`（25, 40, 50, 56, 60, 70, 75, 80, 90, 99, 100）

### デモ動画の扱い（HTML/PDF 出し分け）

スライドにデモ動画を載せる場合、**1つのソースmdから HTML版（動画再生）と PDF版（静止画＋リンク）を出し分ける**。PDF は動画を再生できない（PDF出力は Chromium の印刷経由）ため。

- 画面/HTML用: `<video src="./xxx.mp4">` を `.screen-only` で囲む（ローカルmp4をインライン再生）
- 印刷/PDF用: 「静止画 + リンク」を `.print-only` で囲む（静止画に動画URLをリンクとして埋め込む）
- 切替CSS（スライド内の `<style>` か theme に置く）:

```css
.screen-only { display: block; }
.print-only { display: none; }
@media print {
  .screen-only { display: none; }
  .print-only { display: block; }
}
```

- 動画は公開リポジトリ **slide-assets** にホストし GitHub Pages で配信。そのURLを PDF のリンク先にする
- 再生ボタン等のアイコンは絵文字に頼らず CSS で描く（絵文字はビューア依存で表示が崩れる）

## レイアウトパターン

@LAYOUTS.md

## サンプルファイル

全レイアウトパターンの実使用例:

@samples/sample-wisdom.md

## 重要なルール

1. **`dist/` 内のファイルは直接編集しない** — ビルドで生成
2. **`theme-common.css` 変更後は `npm run sync-themes`** — 全テーマに反映
3. **日付形式は YYYY-MM-DD**
4. **テーマ名はファイル名と一致** — `theme-wisdom.css` → `theme: theme-wisdom`
