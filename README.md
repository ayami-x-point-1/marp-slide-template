# Marp Templates

Marpを使用したプレゼンテーションテンプレート集。4種のテーマと豊富なレイアウトパターンを提供します。

## セットアップ

```bash
# Marp CLIが必要
npm install -g @marp-team/marp-cli
```

## 使い方

### 1. スライドを作成

`slides/` ディレクトリにMarkdownファイルを作成します。

```yaml
---
marp: true
theme: theme-wisdom
paginate: true
---
```

Claude Codeの `/creating-slides` スキルで自動生成も可能です。

### 2. プレビュー

```bash
npm run preview
```

ブラウザが開き、`slides/` 内の全スライドをライブリロード付きでプレビューできます。

### 3. エクスポート

```bash
npm run build       # HTML出力（最新編集ファイル → dist/{名前}/ に出力）
npm run build:pdf   # PDF出力（最新編集ファイル → dist/{名前}/ に出力）
npm run build:all   # slides/内の全ファイル
```

## テーマ

| テーマ | 特徴 | 配色 |
|--------|------|------|
| `theme-toughness` | タフ・力強い | グリーン系グラデーション |
| `theme-wisdom` | 知的・落ち着き | パープル〜ピンク系グラデーション |
| `theme-with_you` | 親しみやすい | レッド〜イエロー系グラデーション |
| `theme-luming` | やわらかい・社外LT向け | クリーム/セピア系（紙のような一枚背景） |

サンプル: `samples/sample-{テーマ名}.md`

### theme-luming について

社外勉強会・カンファレンスなど、会社ブランディングを抑えたい場面向けの汎用テーマ。
以下のLT向けクラスを `<!-- _class: ... -->` で指定できる:

- `core` ─ 持ち帰ってほしい「1つ」を中央に大きく置くスライド
- `hook` ─ 冒頭30秒で予想を裏切る一文を左寄せで提示するスライド
- `pause` ─ 本文中の「あえて省く」印（`<div class="pause">. . .</div>`）

既存3テーマと異なり自己完結型のため、`npm run sync-themes` の対象外。

## テーマのカスタマイズ

共通レイアウトの変更:

```bash
# 1. theme-common.css を編集
# 2. 全テーマに反映
npm run sync-themes
```

## コマンド一覧

| コマンド | 説明 |
|----------|------|
| `npm run preview` | ライブプレビュー（slides/） |
| `npm run build` | 最新ファイルをHTML出力 |
| `npm run build:pdf` | 最新ファイルをPDF出力 |
| `npm run build:all` | 全ファイルビルド |
| `npm run watch` | 最新ファイルを監視・自動ビルド |
| `npm run archive` | slides/の完成スライドをarchive/に移動 |
| `npm run build:samples` | サンプル全テーマビルド |
| `npm run sync-themes` | theme-common.cssを全テーマに反映 |
| `npm run preview:samples` | サンプルプレビュー |

## ディレクトリ構造

```
slides/     作業ディレクトリ（スライドをここに作成）
samples/    テーマ別サンプル（全レイアウトの使用例）
themes/     CSSテーマファイル
archive/    アーカイブ（過去のスライド）
dist/       ビルド出力（dist/{スライド名}/ 構成）
scripts/    ユーティリティスクリプト
```
