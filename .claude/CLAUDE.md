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
├── archive/                   # アーカイブ（git除外）
├── dist/                      # ビルド出力（git除外）
├── scripts/                   # ユーティリティスクリプト
│   └── sync-themes.js
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

# slides/内の完成スライドをarchive/に移動
npm run archive
```

## ワークフロー

1. `/creating-slides` スキルでスライドを生成（`slides/` に出力）
2. `npm run preview` でブラウザプレビュー
3. 編集 → 自動リロードで確認
4. `npm run build` または `npm run build:pdf` で最終出力

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
