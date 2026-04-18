---
name: archiving-slides
description: slides/内の完成スライドを自動命名してarchive/に移動します。スライドのアーカイブ、片付け、整理について言及している場合に使用してください。
disable-model-invocation: true
---

# スライドアーカイブスキル

`slides/` 内の完成スライド（`.md`ファイル）を `archive/` に自動命名して移動します。

## 実行手順

以下のコマンドを実行してください：

```bash
npm run archive
```

## 動作内容

- `slides/` 内の `.md` ファイルを対象（`source.md` と `.gitkeep` は除外）
- `archive/{YYYY-MM-DD}_{ファイル名}/` ディレクトリを作成して移動
- `dist/` 内の対応する HTML/PDF ファイルも一緒に移動
- 同名ディレクトリが既存の場合は連番を付与

## 実行後

アーカイブ結果を表示して完了を報告してください。
