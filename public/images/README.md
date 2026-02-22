# 🖼️ 画像ガイド

## 📐 推奨サイズ

### プレイヤー sprites
- `player-slim.png`: 24x44px（細身）
- `player-normal.png`: 30x40px（通常）
- `player-muscle.png`: 36x44px（筋肉質）
- `player-fat.png`: 39x48px（太め）

### 敵 sprites  
全て 32x32px推奨:
- `enemy-hamburger.png`
- `enemy-fries.png`
- `enemy-pizza.png`
- `enemy-donut.png`
- `enemy-soda.png`
- `enemy-virus.png`
- `enemy-bacteria.png`
- `enemy-mushroom.png`
- `enemy-pathogen.png`
- `enemy-germ.png`

### アイテム sprites
全て 24x24px推奨:
- `item-coin.png`
- `item-dumbbell.png`
- `item-protein.png`
- `item-gymgear.png`
- `item-key.png`

### ブロック sprites
全て 32x32px:
- `block-solid.png`（茶色のブロック）
- `block-breakable.png`（箱ブロック）
- `block-question.png`（❓ブロック）
- `block-ice.png`（氷ブロック）

### 背景 backgrounds
- `title-bg.png`: 800x600px
- `stage1-bg.png`: 800x600px（繰り返し可能）
- `stage2-bg.png`: 800x600px

### UI ui
- `heart-full.png`: 16x16px
- `heart-empty.png`: 16x16px  
- `gauge-bar.png`: 150x18px

## 🎨 カラーパレット

### プレイヤー体型カラー
- SLIM: `#87CEEB` (水色)
- NORMAL: `#FFD700` (金色)
- MUSCLE: `#FF4444` (赤)
- FAT: `#FFA500` (オレンジ)

### ゲーム全体
- メイン: `#00ff88` (ネオングリーン)
- 背景: `#0a0a1a` (ダークブルー)
- UI背景: `rgba(0,0,0,0.8)`

## 📝 画像フォーマット

- **PNG**: 透過が必要なもの（sprites, UI）
- **JPG**: 背景画像
- **最適化**: TinyPNGなどで圧縮推奨

## 🔄 差し替え手順

1. このディレクトリに画像を配置
2. `js/config.js` の `USE_EMOJIS: false` に変更
3. ゲームを再読み込み
4. emoji → 画像に自動切り替え

## 🖌️ デザインのヒント

- **ドット絵スタイル**がマッチします
- **輪郭線**を付けると視認性UP
- **アニメーション**は後から追加可能（スプライトシート化）
- **パレット統一**で世界観が統一されます
