---
marp: true
theme: theme-toughness
paginate: true
---

<!--
_class: title
_paginate: false
-->

# システム改善プロジェクト

## パフォーマンスと保守性の向上

Tech Lead: 田中太郎
2026-02-23

---

<!-- _class: section-divider -->

# アジェンダ

---

## 本日のトピック

<div class="columns">
<div>

### 📊 現状分析

- パフォーマンス指標
- 技術的負債の評価
- ユーザーフィードバック

</div>
<div>

### 🚀 改善提案

- アーキテクチャ刷新
- 段階的な実装計画
- 期待される効果

</div>
</div>

---

## プロジェクトの背景

<div class="highlight">

**課題**: 既存システムのレスポンスタイムが2.5秒を超え、ユーザー体験が悪化している

</div>

<ul class="icon-list">
<li>ピーク時のサーバー負荷が90%を超過</li>
<li>モノリシックな構造による保守性の低下</li>
<li>テストカバレッジが45%と低く、変更リスクが高い</li>
<li>新機能追加に平均3週間かかる状態</li>
</ul>

---

## 現状分析：主要指標

<div class="grid-2x2">

<div class="card">

### ⚡ レスポンス時間

**現状**: 2.5秒
**目標**: 1.0秒

<div class="progress-bar">
  <div class="progress-fill progress-fill-40">40%</div>
</div>

</div>

<div class="card">

### 🧪 テストカバレッジ

**現状**: 45%
**目標**: 80%

<div class="progress-bar">
  <div class="progress-fill progress-fill-56">56%</div>
</div>

</div>

<div class="card">

### 📈 稼働率

**現状**: 99.2%
**目標**: 99.9%

<div class="progress-bar">
  <div class="progress-fill progress-fill-99">99%</div>
</div>

</div>

<div class="card">

### 💰 運用コスト

**現状**: ¥500k/月
**目標**: ¥350k/月

<div class="progress-bar">
  <div class="progress-fill progress-fill-70">70%</div>
</div>

</div>

</div>

---

## 3つの改善アプローチ

<div class="columns-3">

<div class="card">

### 🏗️ アーキテクチャ

- マイクロサービス化
- イベント駆動設計
- キャッシュ戦略

<span class="badge badge-info">Phase 1</span>

</div>

<div class="card">

### 🔬 品質向上

- ユニットテスト拡充
- E2Eテスト導入
- CI/CD構築

<span class="badge badge-warning">Phase 2</span>

</div>

<div class="card">

### 📊 モニタリング

- メトリクス収集
- アラート整備
- ログ分析基盤

<span class="badge badge-success">Phase 3</span>

</div>

</div>

---

## 技術スタック比較

<div class="columns-40-60">

<div>

### 現状

- **フレームワーク**
  Rails 5.2

- **データベース**
  MySQL 5.7

- **キャッシュ**
  なし

- **デプロイ**
  手動デプロイ

</div>

<div>

### 提案

<div class="highlight-success">

- **フレームワーク**
  Rails 7.1 + Next.js 14

- **データベース**
  PostgreSQL 16 + Redis

- **キャッシュ**
  Redis + CloudFront

- **デプロイ**
  GitHub Actions + AWS ECS

</div>

</div>

</div>

---

## 実装計画：タイムライン

<ol class="numbered-list">
<li><strong>Phase 1: 基盤整備</strong> (1ヶ月目)<br>
インフラ構築、テスト環境セットアップ、CI/CD構築</li>

<li><strong>Phase 2: リファクタリング</strong> (2-3ヶ月目)<br>
コア機能のマイクロサービス化、テストカバレッジ向上</li>

<li><strong>Phase 3: 段階的移行</strong> (4-5ヶ月目)<br>
カナリアリリース、モニタリング整備、パフォーマンスチューニング</li>

<li><strong>Phase 4: 完全移行</strong> (6ヶ月目)<br>
全トラフィック移行、旧システム廃止、ドキュメント整備</li>
</ol>

---

## コード例：Before / After

<div class="columns">

<div>

### ❌ Before

```ruby
# 遅い処理
def get_user_stats
  User.all.map do |user|
    {
      name: user.name,
      posts: user.posts.count
    }
  end
end
```

<span class="badge badge-error">N+1問題</span>

</div>

<div>

### ✅ After

```ruby
# 最適化後
def get_user_stats
  User.includes(:posts)
    .select('users.*, COUNT(posts.id) as posts_count')
    .group('users.id')
end
```

<span class="badge badge-success">最適化済み</span>

</div>

</div>

---

## 期待される効果

<div class="focus-area">

## 📈 パフォーマンス **2.5倍向上**

レスポンスタイム: 2.5秒 → **1.0秒**

</div>

<div class="highlight-info">

**その他の改善効果**

- 開発速度: 新機能追加が3週間 → 1週間に短縮
- 運用コスト: 月額50万円 → 35万円に削減（30%減）
- 障害対応: 平均復旧時間が2時間 → 30分に短縮

</div>

---

<!-- _class: quote -->

> "完璧を目指すよりも、まず終わらせろ"

<cite>— Mark Zuckerberg</cite>

---

## 注意事項

<div class="highlight-warning">

**⚠️ 重要**: 本プロジェクトは既存システムへの影響が大きいため、事前の入念な計画と段階的な実装が必須です。

</div>

---

## チーム体制

<div class="grid-3x2">

<div class="card">

### 👨‍💼 PM

田中太郎

</div>

<div class="card">

### 👨‍💻 Backend

佐藤次郎

</div>

<div class="card">

### 🎨 Frontend

鈴木花子

</div>

<div class="card">

### 🧪 QA

高橋三郎

</div>

<div class="card">

### 🔧 DevOps

伊藤四郎

</div>

<div class="card">

### 📊 Data

山田五郎

</div>

</div>

---

## アーキテクチャ概要

<div class="image-text">

<div>

```
┌─────────────┐
│   Client    │
└──────┬──────┘
┌──────▼──────┐
│  CDN / LB   │
└──────┬──────┘
┌──────▼──────┐
│  Services   │
└──────┬──────┘
┌──────▼──────┐
│  Database   │
└─────────────┘
```

</div>

<div>

### システム構成

- **CDN/LB**: CloudFront + ALB
- **Services**: Next.js + マイクロサービス
- **DB**: PostgreSQL + Redis

各レイヤーは独立してスケール可能

</div>

</div>

---

## リスクと対策

| リスク               | 影響度                                      | 対策                          |
| -------------------- | ------------------------------------------- | ----------------------------- |
| 移行時のダウンタイム | <span class="badge badge-error">高</span>   | ブルーグリーンデプロイ採用    |
| データ移行の失敗     | <span class="badge badge-warning">中</span> | 段階的移行 + ロールバック計画 |
| チームのスキル不足   | <span class="badge badge-warning">中</span> | 事前研修 + ペアプログラミング |
| 予算超過             | <span class="badge badge-info">低</span>    | 月次レビュー + 優先度調整     |

---

## まとめ

<div class="columns">

<div>

### ✅ 実施事項

<ul class="icon-list">
<li>アーキテクチャの刷新</li>
<li>テストの充実化</li>
<li>CI/CDパイプライン構築</li>
<li>段階的な移行計画</li>
</ul>

</div>

<div>

### 📅 次のアクション

<ol class="numbered-list">
<li>経営陣への最終承認</li>
<li>開発チームへの説明会</li>
<li>Phase 1 開始準備</li>
</ol>

</div>

</div>

---

<!-- _class: section-divider -->

# Questions?
