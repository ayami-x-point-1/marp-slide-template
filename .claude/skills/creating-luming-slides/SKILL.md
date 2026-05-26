---
name: creating-luming-slides
description: marp-slide-template/slides/source.md を luming テーマの Marp スライドに変換する。自己紹介挿入・キャラクター画像生成（codex 経由）・SVGグラフ生成を内包した orchestrator。luming テーマでスライドを作りたいときに使う。既存 /creating-slides は toughness/wisdom/with_you 用、こちらは luming 専用。
disable-model-invocation: true
---

# creating-luming-slides

luming テーマ専用の source.md → Marp 変換 orchestrator。

## このスキルの根底にある目的

`source.md` には LT の中身が言語化された Markdown が並ぶ。これを luming テーマの Marp スライドにするとき、3つの要素を組み立てる必要がある:

1. **自己紹介スライドの挿入** — luming テーマでは必ず冒頭に自己紹介を入れる
2. **キャラクター画像の自動付与** — スライド内容に応じた luming キャラクターの表情・ポーズを生成して差し込む
3. **SVG グラフの埋め込み** — データや概念図が必要な箇所に SVG を埋め込む

このスキルは自分で全部やるのではなく、サブエージェントに委譲する:

- 画像生成: `luming-image-generator` エージェント（codex CLI 委譲）
- グラフ生成: `graph-generator` エージェント
- 自己紹介: `samples/luming-self-intro.md` のテンプレを読んで挿入

orchestrator の責務は「**事前推論 → 並列ディスパッチ → 結果統合**」だけに絞る。これが守れていれば本流のコンテキストは画像生成・グラフ生成の試行錯誤に侵されない。

## 前提条件

- `marp-slide-template/slides/source.md` にコンテンツがある
- `marp-slide-template/samples/luming-character.png` と `samples/luming-self-intro.md` が存在する
- `codex` CLI が利用可能

## 不変の原則

1. **luming テーマ固定** — 出力 Markdown の frontmatter に `marp: true / theme: theme-luming / paginate: true` を必ず入れる
2. **自己紹介は必ずタイトルスライド直後に挿入** — `samples/luming-self-intro.md` の中身をそのままタイトル直後のスライド位置に挿入する。**内容を改変しない**
3. **画像とグラフの判定は source.md 読み取り直後に一括で行う** — スライドを順に分析し、「何枚の画像 / 何個のグラフ」が必要かを先に確定させる。確定してから並列ディスパッチ
4. **ファイルパスは事前に決める** — 並列実行時の衝突防止のため、エージェントを呼ぶ前に各画像の出力パスを決めて渡す。命名規則:
   - **ライブラリ（生成画像の永続保管）**: `samples/luming-variants/{expression}-{pose}-{angle}.png`（kebab-case）。例: `realization-finger-mouth-3q-left.png`
   - **スライド内参照（LT 単位のコピー）**: `slides/{kebab-title}-luming-{n}.png`（n は 1 から通し番号）
   エージェントには **ライブラリパス** を渡す。生成後 orchestrator がスライド側にコピーする。スライドが参照するのは slides/ 配下のパス
5. **既存ライブラリを必ず先に検索する** — 画像生成は重いので、`samples/luming-variants/` 内の既存画像で代用できるかを先に判定する。表情・ポーズ・アングルの組み合わせが完全一致でなくても、雰囲気・温度感が近ければ再利用する（ファジーマッチ）。判定は LLM 自身が行う。再利用できない場合だけ luming-image-generator を呼ぶ
6. **エージェントは並列で呼ぶ** — 同一メッセージ内に複数の Agent tool 呼び出しを書く。codex 呼び出しは重い（200秒程度かかることもある）ので逐次より並列の総時間短縮効果が大きい
7. **本文を変えない** — source.md のコンテンツ（文章・見出し・順序）は維持する。差し込み（自己紹介・画像・グラフ）と装飾（テーマクラス・レイアウト）だけを追加する
8. **エージェントの試行錯誤を本流に持ち込まない** — エージェントから帰ってきたサマリ（画像のファイルパス / SVG文字列 / エラーメッセージ）だけを扱う。エージェント内部のログ・中間出力は気にしない
9. **既存 `creating-slides` を呼ばない** — 似た役割だが luming 専用なので一切再利用しない

## 変換プロセス

ユーザーへの質問は不要（自動実行）。

### 1. source.md 読み取りと分析

`slides/source.md` を読む。`---` でスライドを分割して列挙。

各スライドについて次を判定:

- **タイトルスライドか**: 最初のスライド、または `<!-- _class: title -->` がある
- **そのスライドの感情状態を一語〜短フレーズで言語化する** — 「予想外の発見」「行き詰まり・限界」「考え込み」「気づきの到達」「やわらかい余韻」「別れの挨拶」「静かな決意」など。**全スライドについて必ず行う**。フック/結び/核心だけでなく、中盤や説明スライドにも感情状態はある。これを抜くと後段でキャラ配置がフック・結びだけに偏る
- **キャラクター画像を入れるか** — 感情状態が明確に言語化できたスライドはキャラを置く候補にする。問いは「**このスライドの感情はどう luming で視覚化できるか**」（「キャラはここに合うか」ではない。主語を変える）
  - 入れる場合: 感情状態に対応する表情/ポーズ/アングルを記述。例:
    - 「予想外の発見・受動的な気づき」→ realization + finger-mouth
    - 「気づきの到達・能動的な発見」→ realization + finger-up
    - 「行き詰まり・限界」→ tired + hugging-knees
    - 「やわらかい余韻・静かな決意」→ smile-soft + relaxed
    - 「別れの挨拶・お礼」→ smile + waving
    - これらは絶対の対応ではない。LT の文脈から再判断する
  - **似た感情でも variant を区別する**: 上記の「受動的な気づき」と「能動的な発見」は両方 realization 系だが pose が違う。LT 中で連続する感情を **同じ variant で流用しない**。聞き手にとってキャラの状態変化が LT の心理アークを伝えるサイン
- **グラフが合うか**: 数値データ・推移・比較・概念フローなど SVG 表現が適切な箇所
  - 合うならグラフ種類とデータを source.md から抽出
- **特殊レイアウトの指定**: `<!-- _class: hook -->`、`<!-- _class: core -->`、`<!-- _class: pause -->` などをそのまま尊重

### 2. 出力ファイル名と画像パスの事前決定

- 出力 marp ファイル: `slides/{kebab-title}.md`（タイトルから kebab-case 生成）
- スライド内で参照する画像パス: `slides/{kebab-title}-luming-{n}.png`（n は 1 から通し番号）
- 各画像について、必要な属性を確定: `{expression}-{pose}-{angle}`
  - 例: `realization-finger-mouth-3q-left`、`smile-waving-3q-right`
  - 属性名は kebab-case の英語で統一（ライブラリの命名規則と一致させるため）

このタイミングで「何枚画像 / 何個グラフ」と「各画像の属性」が確定する。

### 3. ライブラリ検索（生成前の再利用判定）

**画像生成は重い処理（codex 1回 200〜300秒）なので、ライブラリにある既存画像を再利用する**。

手順:

1. `samples/luming-variants/` ディレクトリのファイル一覧を取得（例: `ls samples/luming-variants/*.png`）
2. 各「必要な画像」について、ライブラリ内のファイル名と照らし合わせて**ファジーマッチ**する。LLM 判断（自己判断）で「このスライドの達成したい雰囲気に、ライブラリ内のこの画像が使えるか」を見る:
   - **使える例**: 必要が `realization-finger-mouth-3q-right` だが、ライブラリに `realization-finger-mouth-3q-left` がある → 左右の違いだけなら多くの場合代用可
   - **使える例**: 必要が `thinking-hand-chin-front` だが、ライブラリに `realization-finger-mouth-3q-left` がある → 「思考」「気づき」と仕草が近いので代用可
   - **使えない例**: 必要が `surprise-jumping-front` でライブラリに穏やかな笑顔系しかない → 表情の温度感が違うので不可
3. マッチ判定結果:
   - **使える**（再利用）: 該当ライブラリ画像を `cp samples/luming-variants/{lib-name}.png slides/{kebab-title}-luming-{n}.png` でコピー。エージェント起動は不要
   - **使えない**（新規生成）: 次のステップで luming-image-generator にこの画像の生成を依頼

ライブラリは少しずつ育つ。LT を重ねるほど再利用率が上がり、画像生成コストが減る。

### 4. 並列ディスパッチ（新規生成が必要な画像のみ）

**新規生成が必要な画像とグラフだけ**、同一メッセージ内で全エージェントを並列起動する。

画像が必要な各スライドに対して:
```
Agent(subagent_type: "luming-image-generator", prompt: "
  expression: {内容から導出}
  pose: {内容から導出}
  angle: {内容から導出}
  output_path: /abs/path/to/samples/luming-variants/{exp}-{pose}-{angle}.png
")
```

**重要**: `output_path` は **ライブラリ側のパス**。エージェントはライブラリに直接保存する。エージェントから戻ったら、orchestrator がライブラリから `slides/{kebab-title}-luming-{n}.png` にコピーする（スライド内で参照するパスはあくまで slides/ 配下）。

グラフが必要な各スライドに対して:
```
Agent(subagent_type: "graph-generator", prompt: "
  graph_type: {棒/線/円/概念図/...}
  data: {source.md から抽出した値}
  style: luming テーマ（セピア基調）。色は #6b4a2b / #8a6b46 / #c9b89a / #e8dcc3 / 背景 #f5ecd9
  viewBox: 0 0 1000 600
  title: {見出しから}
")
```

### 5. 結果の統合

エージェントから戻ったら最終 Marp Markdown を組み立てる。テンプレート:

```markdown
---
marp: true
theme: theme-luming
paginate: true
---

<!-- _class: title -->

# {タイトル}
## {サブタイトル}
{メタ情報}

---

{samples/luming-self-intro.md の中身をそのまま}

---

{元の source.md の2枚目以降 + 差し込み画像・グラフ}
```

**差し込みルール**:

- **画像差し込み**: 画像の役割に応じて配置方式を臨機応変に選ぶ。**画像が本文に重なるのは禁止**。次の検証フェーズで重なりがあれば調整する。
  - **画像が主役のスライド**（核心を画像で見せたい / 本文と画像が並列に語る場面）: `.columns-40-60` などの分割レイアウト
    ```
    <div class="columns-40-60">
    <div>

    <img src="./{kebab-title}-luming-{n}.png" width="320" />

    </div>
    <div>

    {本文}

    </div>
    </div>
    ```
  - **画像が挿絵・装飾のスライド**（本文が中心で、キャラを添える）: `position: absolute` でコーナー配置
    ```
    <img src="./{kebab-title}-luming-{n}.png" style="position: absolute; bottom: 30px; right: 30px; width: 200px;" />
    ```
    サイズの目安: 180〜220px。bottom/right は 30〜40px
  - 画像のサイズ・位置はスライド単位で判断。重なりが起きないかは検証フェーズで確認する
- **グラフ差し込み**: 返ってきた SVG 文字列をスライドに埋め込む。`width="100%" style="max-height: 480px; display: block; margin: 0 auto;"` が SVG タグに付いていることを確認（graph-generator が遵守する設計だが念のため統合時に検証）。**SVG 内に空行を入れない**
- **自己紹介**: `samples/luming-self-intro.md` の本文（frontmatter は元から無い）をタイトル直後のスライド位置にそのまま挿入

レイアウトパターンと記法ルールはサンプルファイルに従う:

@samples/sample-luming.md

@LAYOUTS.md

### 6. 出力

`slides/{kebab-title}.md` に書き出す。`slides/source.md` は変更しない。

### 7. ブラウザ検証フェーズ

出力したら、**必ずブラウザで開いて見え方を検証する**。LLM 判断と実際のレンダリングは乖離するため、視覚を介さない検証はバグを残す。

**手順**:

1. marp プレビューサーバーが起動していなければ起動: `npm run preview` をバックグラウンドで実行
2. claude-in-chrome MCP ツールをロード（`ToolSearch` で `tabs_context_mcp`, `navigate`, `javascript_tool` を取得）
3. `http://localhost:8080/{kebab-title}.md` をブラウザで開く
4. JavaScript で各スライドの要素を取得し、次を全スライドについて検証:

```javascript
const sections = document.querySelectorAll('section');
const overlap = (a, b) => !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);
const result = Array.from(sections).map((sec, i) => {
  const rect = sec.getBoundingClientRect();
  const img = sec.querySelector('img');
  const svg = sec.querySelector('svg');
  const text = sec.querySelectorAll('h1, h2, p, ul, ol');
  const issues = [];
  for (const visual of [img, svg].filter(Boolean)) {
    const vr = visual.getBoundingClientRect();
    if (vr.bottom > rect.bottom) issues.push(`${visual.tagName} overflows bottom by ${(vr.bottom-rect.bottom).toFixed(0)}`);
    if (vr.right > rect.right) issues.push(`${visual.tagName} overflows right by ${(vr.right-rect.right).toFixed(0)}`);
    for (const t of text) {
      if (overlap(vr, t.getBoundingClientRect())) issues.push(`${visual.tagName} overlaps ${t.tagName}: "${t.textContent.slice(0,30)}"`);
    }
  }
  return { slide: i+1, issues };
});
JSON.stringify(result.filter(r => r.issues.length > 0));
```

5. 問題が出たスライドについて修正:
   - 画像が本文に重なる → 画像サイズを縮める（180→150px 等）、または位置をコーナー寄せ、または `.columns-40-60` レイアウトに変更
   - 画像が下/右にはみ出す → サイズ縮小、または位置の bottom/right を増やす
   - SVG がはみ出す → graph-generator の原則違反。生成 SVG を確認し、`width="100%"` と `max-height: 480px` style が正しく付いているか確認
6. 修正したら手順 4 に戻って再検証。重なりがゼロになるまで繰り返す（最大 3 回まで。それでも収まらなければユーザーに報告）

このフェーズは「LLM が「重ならないはず」と判断したものが実際に重なっていた」という事故を防ぐためにある。**LLM 推論はレイアウトの実測値より弱い**。視覚を持つブラウザの計測値を信頼する。

## 失敗時の振る舞い

- `luming-image-generator` が失敗（codex エラー、出力ファイル不正など）→ そのスライドからは画像を省く。他の処理は続行
- `graph-generator` が失敗（SVG 生成失敗）→ そのスライドからはグラフを省く
- `samples/luming-self-intro.md` が見つからない → 致命的エラーで停止
- `slides/source.md` が空 → 致命的エラーで停止

エージェント失敗時もスライド全体は出力する。最後に「画像 N 枚中 M 枚成功、グラフ N 個中 M 個成功」をユーザーに報告。

## 生成後

ファイル生成後、以下を案内:

```bash
npm run preview    # ライブプレビュー
npm run build      # HTML出力
npm run build:pdf  # PDF出力
```
