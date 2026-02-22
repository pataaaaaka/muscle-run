# 🎮 MUSCLE TRAINER

体型変化アクションゲーム - Get Fit or Get Fat!

## 🚀 Vercelデプロイ（推奨）

### クイックスタート

```bash
# 1. GitHubにアップロード
git init
git add .
git commit -m "🎮 Initial: MUSCLE TRAINER"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/muscle-trainer.git
git push -u origin main

# 2. Vercelでデプロイ
# https://vercel.com にアクセス
# New Project → GitHubリポジトリを選択 → Deploy
```

**設定不要！** このプロジェクトは自動的に検出されます。

## 📁 プロジェクト構造（モジュール版）

```
muscle-trainer-game/
├── index.html              ← メインHTML
├── game-full.html          ← 1ファイル版（バックアップ）
├── styles.css
├── vercel.json             ← Vercel設定
│
├── js/                     ← JavaScriptモジュール
│   ├── config.js          ← 画像パス・設定
│   ├── player-core.js     ← プレイヤーシステム
│   ├── stage-data.js      ← ステージデータ
│   ├── game.js            ← ゲームループ
│   │
│   ├── enemies/           ← 敵システム
│   │   ├── base-enemy.js
│   │   ├── food-enemies.js
│   │   ├── virus-enemies.js
│   │   └── enemy-manager.js
│   │
│   ├── items/             ← アイテムシステム
│   │   ├── base-item.js
│   │   ├── items.js
│   │   └── item-manager.js
│   │
│   └── blocks/            ← ブロックシステム
│       ├── base-block.js
│       ├── blocks.js
│       └── block-manager.js
│
└── public/images/         ← 画像差し替え用
    ├── sprites/
    ├── backgrounds/
    └── ui/
```

## 🛠️ カスタマイズ方法

### プレイヤーの速度を変更

`js/player-core.js` を編集：

```javascript
const PLAYER_SPEED = 4;  // ← この値を変更
const JUMP_POWER = -12;  // ← ジャンプ力
```

### 新しい敵を追加

1. `js/enemies/food-enemies.js` に新しいクラスを追加
2. `js/enemies/enemy-manager.js` の `enemyTypes` 配列に追加
3. `js/stage-data.js` のステージデータで配置

### 新しいステージを追加

`js/stage-data.js` を編集：

```javascript
const STAGE_DATA = {
  "1-1": { ... },
  "1-2": { ... },
  "2-1": {  // ← 新しいステージ
    name: "New Stage",
    blocks: [...],
    enemies: [...],
    items: [...]
  }
};
```

### 画像を追加

1. `public/images/sprites/` に画像を配置
2. `js/config.js` で `USE_EMOJIS: false` に変更
3. 各クラスのdraw()メソッドでemoji→画像に変更

## 🧪 ローカルテスト

```bash
# Python
python3 -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

→ http://localhost:8000

## 📝 よくある問題

### Vercelで真っ白になる

- **原因**: JSファイルが404
- **解決**: `vercel.json` が正しいか確認（このプロジェクトは既に修正済み）

### ローカルで404エラー

- **原因**: `file://` プロトコルで開いている
- **解決**: 必ずローカルサーバー経由で開く

### プレイヤーが動かない

- **原因**: `canvas.height` エラー
- **解決**: このプロジェクトは修正済み

## 🎮 操作方法

- **← →** (A D): 移動
- **Space** (↑): ジャンプ
- **Shift** (X): ダッシュ
- **Q**: FAT+1（デバッグ）
- **E**: MUSCLE+1（デバッグ）
- **R**: ゲージリセット

## 🎯 ゲームシステム

### 体型変化

- **SLIM**: 速い、高ジャンプ（水色）
- **NORMAL**: バランス型（金色）
- **MUSCLE**: パワフル、鉄アレイ投擲可能（赤）
- **FAT**: 遅い、重い（オレンジ）

### 敵

**食べ物系**（触るとFAT上昇）
- 🍔 ハンバーガー
- 🍟 フライドポテト
- 🍕 ピザ
- 🍩 ドーナツ
- 🧃 ソーダ

**ウイルス系**（倒すとMUSCLE上昇）
- 🦠 ウイルス
- 🧪 バクテリア
- 🍄 毒キノコ
- 🕷️ 病原体
- 💀 腐敗菌

## 🌟 モジュール版のメリット

✅ **ファイルごとに編集可能** - 敵だけ、アイテムだけ変更できる
✅ **Git差分が見やすい** - どこを変更したか一目瞭然
✅ **チーム開発向き** - 分担して開発できる
✅ **デバッグしやすい** - エラー箇所が特定しやすい
✅ **再利用可能** - 他のプロジェクトに移植できる

## 📦 1ファイル版との使い分け

- **モジュール版（index.html）**: 開発・カスタマイズ用 ← 推奨
- **1ファイル版（game-full.html）**: デモ・配布用

## 📝 ライセンス

MIT License

## 👥 開発

このゲームは Claude と共同で開発されました。
