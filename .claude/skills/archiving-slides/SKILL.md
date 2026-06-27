---
name: archiving-slides
description: 完成したスライドを lt-archives リポジトリへアーカイブし、デモ動画を slide-assets へ配置し、両リポジトリで PR を作成する。スライドのアーカイブ、片付け、登壇後の整理について言及された場合に使用する。
disable-model-invocation: true
---

# スライドアーカイブスキル

`slides/` の完成スライドを、後から開いても壊れない自己完結フォルダとして **lt-archives**（非公開）へアーカイブし、デモ動画を **slide-assets**（公開 / GitHub Pages配信）へ配置する。両リポジトリは **PR運用**（main直push はしない）。

## 前提（リポジトリ配置）

ワークスペース直下に独立リポジトリが並ぶ:

- `marp-slide-template/` … スライド制作（このスキルがある場所）
- `lt-archives/` … 完成アーカイブ（Private）
- `slide-assets/` … デモ動画の公開配信（Public / GitHub Pages）

いずれも個人アカウント `aym-sekiguchi` 所有。git著者は各リポジトリのローカル設定で個人に固定済み。
gh操作（PR作成など）は**個人トークン**を明示的に使う:

```bash
GH_TOKEN="$(gh auth token --user aym-sekiguchi)"
```

## 手順

### 1. イベント日を決める

- 呼び出し時に日付（`YYYY-MM-DD`）が渡されていれば、それを使う
- 渡されていなければ、**AskUserQuestion** で「このアーカイブのイベント日（`YYYY-MM-DD`）」を質問して確定する
  - meta.md は参照しない（marp-slide-template 単体では存在しないため、前提にしない）

### 2. アーカイブ実行

marp-slide-template で:

```bash
npm run archive -- <イベント日>
```

この結果:

- `slides/*.md`（本体・`source.md`）が `lt-archives/{日付}_{名前}/` へ**移動**
- HTML/PDF が `dist/{名前}/` から同フォルダへ**コピー**（dist は保持）
- 参照ローカルアセット（画像・mp4）が同フォルダへ**コピー**（slides は保持）
- mp4 は `slide-assets/{日付}_{名前}/` にも**コピー**

出力ログから「作成された lt-archives フォルダ名（`{日付}_{名前}`）」と「slide-assets に mp4 が追加されたか」を把握する。
`{名前}` はスライドのベース名（例: `parallel-agent-care`）。

### 3. lt-archives を PR 化

```bash
cd ../lt-archives
git switch main && git pull --ff-only
git switch -c "archive/{日付}_{名前}"
git add .
git commit -m "Archive {日付}_{名前}"
git push -u origin "archive/{日付}_{名前}"
GH_TOKEN="$(gh auth token --user aym-sekiguchi)" gh pr create \
  --repo aym-sekiguchi/lt-archives --base main \
  --head "archive/{日付}_{名前}" \
  --title "Archive {日付}_{名前}" \
  --body "<登壇名・日付などの概要>"
```

### 4. slide-assets を PR 化（mp4 が増えた場合のみ）

mp4 が `slide-assets/` に追加されたときだけ実行する。動画の無い talk では何もしない。

```bash
cd ../slide-assets
git switch main && git pull --ff-only
git switch -c "add/{日付}_{名前}"
git add .
git commit -m "Add {日付}_{名前} demo videos"
git push -u origin "add/{日付}_{名前}"
GH_TOKEN="$(gh auth token --user aym-sekiguchi)" gh pr create \
  --repo aym-sekiguchi/slide-assets --base main \
  --head "add/{日付}_{名前}" \
  --title "Add {日付}_{名前} demo videos" \
  --body "<概要>"
```

### 5. 報告

- アーカイブ先: `lt-archives/{日付}_{名前}/`
- 作成した PR の URL（lt-archives、必要なら slide-assets）

## 注意

- **main へ直接 push しない**（PR運用）。
- `npm run archive` は日付未指定だとエラーで止まる（誤った日付で進まない安全網）。必ず手順1で日付を確定してから実行する。
- 複数の本体スライドを同時にアーカイブした場合は、talk ごとに手順3〜4を繰り返す（ブランチ・PRも talk 単位）。
