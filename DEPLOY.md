# 🚀 デプロイ手順

## 📦 準備

このプロジェクトには2つのバージョンがあります：

1. **game-full.html** - 1ファイル完結版（すぐに動作）
2. **index.html + js/** - モジュール分割版（拡張しやすい）

## 方法1: Vercel（推奨）

### ステップ1: GitHubにプッシュ

```bash
cd muscle-trainer-game
git init
git add .
git commit -m "Initial commit: MUSCLE TRAINER game"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/muscle-trainer.git
git push -u origin main
```

### ステップ2: Vercelでデプロイ

1. https://vercel.com にアクセス
2. 「New Project」をクリック
3. GitHubリポジトリを選択
4. 「Deploy」をクリック
5. 完了！URLが発行されます

## 方法2: GitHub Pages

### ステップ1: GitHubにプッシュ（上記と同じ）

### ステップ2: GitHub Pagesを有効化

1. GitHubリポジトリの「Settings」タブ
2. 左メニューの「Pages」
3. Source: 「main」ブランチを選択
4. 「Save」
5. 数分後に https://YOUR_USERNAME.github.io/muscle-trainer/ で公開

## 方法3: Netlify

### Netlify Drop

1. https://app.netlify.com/drop にアクセス
2. `muscle-trainer-game` フォルダをドラッグ&ドロップ
3. 即座にデプロイ完了！

## 🧪 ローカルテスト

```bash
# Python
python3 -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

ブラウザで http://localhost:8000/game-full.html を開く

## 🖼️ 画像を追加する場合

### 1. 画像を配置

```
public/images/sprites/
├── player-normal.png      # 32x40px推奨
├── player-slim.png
├── player-muscle.png
├── player-fat.png
├── enemy-hamburger.png    # 32x32px推奨
└── ...
```

### 2. game-full.htmlを編集

emoji部分を画像に置き換える：

```javascript
// Before (emoji)
ctx.fillText(this.emoji, this.x + this.width / 2, this.y + this.height / 2);

// After (image)
const img = new Image();
img.src = 'public/images/sprites/player-normal.png';
ctx.drawImage(img, this.x, this.y, this.width, this.height);
```

## ✅ デプロイ確認チェックリスト

- [ ] ゲームが正常に起動する
- [ ] プレイヤーが動く（←→キー）
- [ ] ジャンプが機能する（Spaceキー）
- [ ] 敵が表示される
- [ ] ゲージが表示される
- [ ] ステージクリアできる
- [ ] モバイルでも表示される（レスポンシブ）

## 🔧 トラブルシューティング

### エラー: "canvas.height is undefined"
→ `game-full.html`の154行目付近を確認
→ `const canvas = this.game.canvas || {width:800, height:600};` になっているか

### 画像が表示されない
→ パスが正しいか確認（`public/images/...`）
→ ブラウザの開発者ツールでネットワークタブを確認

### モバイルで動かない
→ `styles.css`のレスポンシブ設定を確認
→ タッチ操作対応が必要な場合は追加実装

## 📞 サポート

問題が発生した場合：
1. ブラウザのコンソール（F12）でエラーを確認
2. README.mdを参照
3. GitHubでIssueを作成
