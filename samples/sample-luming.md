---
marp: true
theme: theme-luming
paginate: true
---

<!-- _class: title -->

# Luming

## やわらかくほどける、隣の時間

社外LT用テンプレート / sample-luming

---

# インライン画像

<div class="columns-40-60">
<div>

<img src="./luming-character.png" width="320" />

</div>
<div>

### キャラクター差し込み

`.columns-40-60` と組み合わせると、
左に画像・右にテキストの
紹介スライドが組める。

`<img>` タグで `width` や `style` を
自由に調整できます。

</div>
</div>

---

# コーナー配置

`position: absolute` で文字に被らない位置に置けます。

- `bottom` / `right` / `top` / `left` で位置指定
- `width` でサイズ調整
- 本文の流れには影響しない

<img src="./luming-character.png"
     style="position: absolute; bottom: 40px; right: 60px; width: 220px;" />

---

<!-- _class: hook -->

ちゃんと**休ませる**と、
やわらかくなるんだよ。

冒頭フックの一文をここに置く

---

<!-- _class: core -->

# このLTで持ち帰ってほしい1つ

---

# 概要

このスライドは Luming テーマの紹介。

- **会社外LT** のために用意した汎用テーマ
- セピア基調・やわらかいセリフ・紙のような背景
- LT向けのクラス（`.core` / `.hook` / `.pause`）を提供
- 既存3テーマとは独立した自己完結型

> やわらかい灯りのような存在。
> ―― Luming のコンセプト

---

# ピル型タグ

Luming テーマの特徴の一つは、丸いタグのデザイン。

<div class="tags">
<span class="tag">やわらかさ</span>
<span class="tag">静かな夜</span>
<span class="tag">小さな灯り</span>
<span class="tag-soft tag">無理しない</span>
<span class="tag-soft tag">ほどける</span>
<span class="tag-accent tag">隣にいる</span>
</div>

タグは「キーワードを並べる」「世界観を提示する」用途に使う。

---

# カードレイアウト

<div class="columns-3">
<div class="card">

### 焼きたて

オーブンを開けた瞬間の、
やわらかい温度。

</div>
<div class="card">

### 静かな夜

声の大きさを少しだけ
落とすような時間。

</div>
<div class="card">

### 隣にいる

何かを変えるのではなく、
ただ、そばにいる。

</div>
</div>

<div class="soft-box-accent soft-box">

このスライドは `.card` と `.soft-box-accent` を組み合わせている。

</div>

---

# 2カラム

<div class="columns">
<div>

### 左カラム

- やわらかい配色
- ピル型のタグ
- セピアの罫線
- セリフの見出し

</div>
<div>

### 右カラム

`code` も同じトーン。

```js
const luming = {
  warmth: 'soft',
  brightness: 'low',
  presence: 'next to you'
};
```

</div>
</div>

---

<!-- _class: section-divider -->

# 本文

ーー LTの中身ーー

---

# 本文スライドの例

ここから核心の話に入る。

1. やわらかい言葉で
2. でも核心は外さず
3. 必要なことだけ

<div class="pause">. . .</div>

ここで一拍。聞き手の余白を作る。

---

# テーブル

| 要素 | 役割 | LT原則との対応 |
|------|------|----------------|
| `.core` | 核心スライド | 要点は1つに絞る |
| `.hook` | 冒頭の違和感 | 印象に残るフック |
| `.pause` | あえての沈黙 | 省く部分を作る |

---

<!-- _class: title -->

# ありがとうございました

## ＿ Luming ＿

ayami / 2026
