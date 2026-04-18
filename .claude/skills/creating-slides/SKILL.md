---
name: creating-slides
description: slides/source.mdに用意されたMarkdownコンテンツをMarpプレゼンテーション形式に変換します。プレゼン作成、スライド作成、スライド変換、Marp変換について言及している場合に使用してください。
argument-hint: "<テーマ名: toughness / wisdom / with_you>"
disable-model-invocation: true
---

# Marpスライド変換スキル

`slides/source.md` に用意されたMarkdownコンテンツを読み取り、Marpプレゼンテーション形式に変換して `slides/` に別名で出力します。

## 使用方法

```bash
/creating-slides <テーマ名>
```

テーマ名は `toughness`、`wisdom`、`with_you` のいずれかを指定します。`$ARGUMENTS` で受け取ります。

## 前提条件

`slides/source.md` にベースとなるMarkdownコンテンツが存在すること。

## 変換プロセス

ユーザーへの質問は不要です。

### 1. source.mdを読み取る

`slides/source.md` を読み取り、コンテンツを分析します。

### 2. テーマ適用・自動判断

- **テーマ**: `$ARGUMENTS` で指定されたテーマを使用（`toughness` → `theme-toughness`、`wisdom` → `theme-wisdom`、`with_you` → `theme-with_you`）
- **タイトル/サブタイトル**: コンテンツの見出しや主題から抽出
- **スライド分割**: 内容の意味的なまとまりでスライドを分割
- **レイアウト選択**: 各スライドの内容に最適なレイアウトパターンを適用
- **出力ファイル名**: タイトルからケバブケース（例: `system-improvement.md`）で自動生成

### 3. Marp形式へ変換

レイアウトパターンと記法ルールはサンプルファイルに従ってください。

@samples/sample-wisdom.md
@LAYOUTS.md

### 4. 出力

`slides/{タイトルから生成した名前}.md` に書き出します。`slides/source.md` は変更しません。

## 生成後

ファイル生成後、以下を案内:

```bash
npm run preview    # ライブプレビュー
npm run build      # HTML出力
npm run build:pdf  # PDF出力
```
