---
name: creating-slides
description: Marpプレゼンテーション用の新しいMarkdownファイルを生成します。テーマとレイアウトパターンを選択し、スライド構成に沿った.mdファイルをslides/ディレクトリに作成します。プレゼン作成、スライド作成、Marp、プレゼンテーション生成について言及している場合に使用してください。
argument-hint: "[タイトル]"
disable-model-invocation: true
---

# Marpプレゼンテーション作成スキル

このスキルは、Marpを使用したプレゼンテーション用のMarkdownファイルを `slides/` ディレクトリに作成します。

## 使用方法

```bash
/creating-slides [タイトル]
```

- `[タイトル]` は省略可能です
- タイトルを指定すると、そのタイトルでプレゼンファイルを生成します
- 省略した場合は、対話的にパラメータを収集します

## パラメータ収集手順

以下の情報をユーザーから収集してください。

### 1. テーマ選択

3つのテーマから選択してもらいます。`AskUserQuestion` を使用してください。

- **theme-toughness** - タフ・力強いデザイン（グリーン系グラデーション）
- **theme-wisdom** - 知的・落ち着いたデザイン（パープル〜ピンク系グラデーション）
- **theme-with_you** - 親しみやすいデザイン（レッド〜イエロー系グラデーション）

### 2. プレゼンテーション情報

- **タイトル**（必須）: `$ARGUMENTS` で第1引数を受け取った場合はそれを使用、なければ対話的に収集
- **サブタイトル**（任意）: 例「パフォーマンスと保守性の向上」
- **発表者名**（任意）: 例「Tech Lead: 田中太郎」
- **日付**（任意）: YYYY-MM-DD形式、省略時は今日の日付を使用

### 3. スライド構成

ユーザーにプレゼンの内容を箇条書きで説明してもらいます。

例:
```
- 背景と課題
- 現状分析（主要指標を4つ）
- 改善提案（3つのアプローチ）
- 技術スタック比較
- 実装計画
- 期待される効果
- まとめ
```

## ファイル生成

### ファイル名と出力先

`slides/{スライド名}.md` の形式で生成します。

例: `slides/system-improvement.md`

### テンプレート構造

以下の順序でスライドを構成してください。

#### 1. フロントマター

```yaml
---
marp: true
theme: theme-{選択したテーマ}
paginate: true
---
```

#### 2. タイトルスライド

```markdown
<!--
_class: title
_paginate: false
-->

# {タイトル}

## {サブタイトル}

{発表者名}
{日付}
```

#### 3. アジェンダスライド

```markdown
---

<!-- _class: section-divider -->

# アジェンダ

---

## 本日のトピック

{ユーザーが指定した構成を2カラムまたは箇条書きで表示}
```

#### 4. コンテンツスライド

ユーザーが指定した構成に基づいて、適切なレイアウトパターンを選択してスライドを作成します。

#### 5. まとめスライド

```markdown
---

## まとめ

{主要ポイントを簡潔にまとめる}

---

<!-- _class: section-divider -->

# Questions?
```

## レイアウトパターン選択指針

コンテンツの性質に応じて、以下のレイアウトパターンを使い分けてください。

### 比較・対比

- **2カラム（50:50）**: `<div class="columns">`
- **非対称（40:60）**: `<div class="columns-40-60">`

例: Before/After、現状vs提案

### 並列の3項目

- **3カラム**: `<div class="columns-3">`

例: Phase 1/2/3、3つのアプローチ

### 情報カード群

- **2×2グリッド**: `<div class="grid-2x2">`
- **3×2グリッド**: `<div class="grid-3x2">`

各カードは `<div class="card">` で囲みます。

例: 主要指標、チーム体制、機能一覧

### 重要なメッセージ強調

- **フォーカスエリア**: `<div class="focus-area">`
- **ハイライト**: `<div class="highlight">`
- **カラー付きハイライト**: `<div class="highlight-success">` / `highlight-warning` / `highlight-info`

例: 期待される効果、注意事項

### 手順・ステップ

- **数字バッジ付きリスト**: `<ol class="numbered-list">`

例: 実装計画、タイムライン

### チェックリスト・達成項目

- **アイコン付きリスト**: `<ul class="icon-list">`

例: 実施事項、課題リスト

### ステータス表示

- **バッジ**: `<span class="badge badge-{種類}">`
  - `badge-success` - 緑（完了、良好）
  - `badge-warning` - 黄（進行中、注意）
  - `badge-error` - 赤（エラー、高リスク）
  - `badge-info` - 青（情報、低リスク）

例: Phase番号、ステータス、リスクレベル

### 進捗状況

- **プログレスバー**: `<div class="progress-bar">` + `<div class="progress-fill progress-fill-{数値}">`

**重要**: 幅は `progress-fill-{数値}` クラスで指定します（`style` 属性ではありません）

```markdown
<div class="progress-bar">
  <div class="progress-fill progress-fill-75">75%</div>
</div>
```

利用可能な数値: 25, 40, 50, 56, 60, 70, 75, 80, 90, 99, 100

### 特別なスライドクラス

- `<!-- _class: title -->` - タイトルスライド
- `<!-- _class: section-divider -->` - セクション区切り
- `<!-- _class: quote -->` - 引用スライド

## 重要な注意事項

### 1. `<div>` タグの前後には必ず空行を入れる

```markdown
正しい:

<div class="columns">
<div>

### コンテンツ

</div>
</div>

誤り:

<div class="columns">
<div>
### コンテンツ
</div>
</div>
```

### 2. progress-fill は **クラス** で指定

```markdown
正しい:
<div class="progress-fill progress-fill-75">75%</div>

誤り:
<div class="progress-fill" style="width: 75%">75%</div>
```

### 3. 日付は YYYY-MM-DD 形式

```markdown
2026-02-23
```

### 4. スライド区切りは `---`

```markdown
---

## 次のスライド
```

## 生成後の確認

ファイル生成後、以下を確認してください。

1. ファイルが `slides/` に作成されたことを報告
2. プレビューコマンドを案内

```bash
# ライブプレビュー
npm run preview

# HTML出力
npm run build

# PDF出力
npm run build:pdf
```

3. 生成されたファイルパスを表示

## 実装例

参照: `@samples/sample-wisdom.md`

このファイルには、すべてのレイアウトパターンの実際の使用例が含まれています。
