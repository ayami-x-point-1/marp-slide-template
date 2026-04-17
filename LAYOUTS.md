# Marp レイアウトパターンガイド

このガイドでは、テーマで使用できるおしゃれなレイアウトパターンを紹介します。

## 📐 カラムレイアウト

### 2カラム（50:50）

```markdown
<div class="columns">
<div>

### 左側のコンテンツ
- 項目1
- 項目2

</div>
<div>

### 右側のコンテンツ
- 項目A
- 項目B

</div>
</div>
```

### 3カラム

```markdown
<div class="columns-3">
<div>内容1</div>
<div>内容2</div>
<div>内容3</div>
</div>
```

### 非対称（40:60）

```markdown
<div class="columns-40-60">
<div>左側（狭い）</div>
<div>右側（広い）</div>
</div>
```

---

## 🎴 カードレイアウト

```markdown
<div class="card">

### カードタイトル
カードの内容がここに入ります。

</div>
```

### グリッド（2×2）

```markdown
<div class="grid-2x2">
<div class="card">カード1</div>
<div class="card">カード2</div>
<div class="card">カード3</div>
<div class="card">カード4</div>
</div>
```

---

## 💡 ハイライトボックス

### 基本

```markdown
<div class="highlight">
重要な情報をここに表示
</div>
```

### カラーバリエーション

```markdown
<div class="highlight-success">成功・完了メッセージ</div>
<div class="highlight-warning">警告メッセージ</div>
<div class="highlight-info">情報メッセージ</div>
```

---

## ✓ アイコン付きリスト

```markdown
<ul class="icon-list">
<li>チェックマーク付きの項目1</li>
<li>チェックマーク付きの項目2</li>
<li>チェックマーク付きの項目3</li>
</ul>
```

---

## 🔢 数字バッジ付きリスト

```markdown
<ol class="numbered-list">
<li>ステップ1の説明</li>
<li>ステップ2の説明</li>
<li>ステップ3の説明</li>
</ol>
```

---

## 🏷️ ステータスバッジ

```markdown
<span class="badge badge-success">完了</span>
<span class="badge badge-warning">進行中</span>
<span class="badge badge-error">エラー</span>
<span class="badge badge-info">情報</span>
```

---

## 📊 プログレスバー

```markdown
<div class="progress-bar">
  <div class="progress-fill" style="width: 75%">75%</div>
</div>
```

---

## 🎯 フォーカスエリア（中央強調）

```markdown
<div class="focus-area">

## 重要なメッセージ

ここに強調したい内容を記載

</div>
```

---

## 🖼️ 画像とテキストの横並び

```markdown
<div class="image-text">

![](image.png)

<div>

### 説明テキスト
画像の横に表示するテキスト

</div>

</div>
```

---

## 📄 特別なスライドクラス

### タイトルスライド（表紙）

```markdown
<!-- _class: title -->

# プレゼンテーションタイトル
## サブタイトル
発表者名
```

### セクション区切り

```markdown
<!-- _class: section-divider -->

# セクション名
```

### 引用スライド（フルスクリーン）

```markdown
<!-- _class: quote -->

> "引用文をここに記載"

<cite>— 引用元</cite>
```

---

## 🎨 実践例：ダッシュボード風スライド

```markdown
## システムステータス

<div class="grid-2x2">

<div class="card">

### ⚡ レスポンス時間
**現状**: 1.2秒
<div class="progress-bar">
  <div class="progress-fill" style="width: 80%">80%</div>
</div>
<span class="badge badge-success">良好</span>

</div>

<div class="card">

### 🧪 テストカバレッジ
**現状**: 75%
<div class="progress-bar">
  <div class="progress-fill" style="width: 75%">75%</div>
</div>
<span class="badge badge-warning">改善中</span>

</div>

<div class="card">

### 📈 稼働率
**現状**: 99.9%
<div class="progress-bar">
  <div class="progress-fill" style="width: 99%">99.9%</div>
</div>
<span class="badge badge-success">優秀</span>

</div>

<div class="card">

### 💰 運用コスト
**削減率**: 30%
<div class="progress-bar">
  <div class="progress-fill" style="width: 70%">70%</div>
</div>
<span class="badge badge-info">順調</span>

</div>

</div>
```

---

## 💡 Tips

1. **`<div>`タグの前後には空行を入れる**
   - マークダウンとHTMLを混在させる場合、空行が必要です

2. **HTMLタグ内でもマークダウンは使える**
   - 見出し、リスト、強調などは通常通り使用可能

3. **ページネーションを無効にする**
   ```markdown
   <!-- _paginate: false -->
   ```

4. **スライド固有のスタイルを追加**
   ```markdown
   <!-- _style: "background: #f0f0f0;" -->
   ```

5. **複数のクラスを適用**
   ```markdown
   <!-- _class: title center -->
   ```

---

## 📚 参考リンク

- [Marp公式ドキュメント](https://marpit.marp.app/)
- [Marp CLI](https://github.com/marp-team/marp-cli)
- サンプルファイル: `sample-advanced-toughness.md`
