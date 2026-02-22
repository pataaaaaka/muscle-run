# 🚀 Vercel デプロイ完全ガイド

## ❌ よくある404エラーの原因

Vercelで404が出る原因：
1. **ルートディレクトリ設定ミス**
2. **Output Directory設定ミス**
3. **ファイルパスの大文字小文字**
4. **不要なvercel.json**

## ✅ 確実に動作するデプロイ手順

### ステップ1: GitHubにプッシュ

```bash
cd muscle-trainer-game

# vercel.jsonは削除済み（Vercelが自動検出）
git add .
git commit -m "Fix: Vercel 404対応"
git push
```

### ステップ2: Vercelで設定

1. https://vercel.com/new にアクセス
2. GitHubリポジトリを選択
3. **重要な設定：**

```
Framework Preset: Other
Root Directory: ./
Output Directory: (空欄のまま)
Build Command: (空欄のまま)
Install Command: (空欄のまま)
```

4. 「Deploy」をクリック

### ステップ3: デプロイ後の確認

✅ 成功した場合:
- タイトル画面「MUSCLE TRAINER」が表示
- コンソールにエラーなし

❌ 404が出る場合:
1. Vercelダッシュボード → プロジェクト → Settings
2. **Root Directory** を確認: `./` または空欄
3. **Build & Development Settings**:
   - Build Command: 空欄
   - Output Directory: 空欄
   - Install Command: 空欄

### ステップ4: 再デプロイ

設定を変更したら:
1. 「Deployments」タブ
2. 最新のデプロイの「...」メニュー
3. 「Redeploy」

## 🔍 デバッグ方法

### Vercelのログを確認

1. Deployments → 失敗したデプロイをクリック
2. 「Build Logs」を確認
3. エラーメッセージを確認

### ローカルで確認

デプロイ前に必ずローカルでテスト:

```bash
# ローカルサーバー起動
python3 -m http.server 8000

# ブラウザで開く
http://localhost:8000
```

✅ ローカルで動けばVercelでも動く

## 📝 プロジェクト構造（Vercel用）

```
muscle-trainer-game/        ← これがRoot Directory
├── index.html              ← エントリーポイント
├── game-full.html          ← バックアップ
├── styles.css              ← スタイル
├── js/                     ← JavaScript
│   ├── config.js
│   ├── player-core.js
│   ├── enemies/
│   ├── items/
│   ├── blocks/
│   ├── stage-data.js
│   └── game.js
├── public/
│   └── images/             ← 画像
├── package.json            ← npm設定（オプション）
└── .vercelignore           ← 除外ファイル
```

## 🎯 確実に動作させる最終手段

上記で解決しない場合：

### オプションA: 1ファイル版を使う

```bash
# index.htmlをgame-full.htmlに置き換え
cp game-full.html index.html
git add index.html
git commit -m "Use single-file version for Vercel"
git push
```

→ Vercelで自動再デプロイ → 確実に動作

### オプションB: GitHub Pagesを使う

```bash
# GitHubリポジトリのSettings → Pages
# Source: main branch
# Root: / (root)
```

→ 数分後に `https://YOUR_USERNAME.github.io/muscle-trainer/` で公開

## ⚠️ 注意事項

### ファイル名の大文字小文字

- ❌ `Index.html` → Vercelは認識しない
- ✅ `index.html` → 正しい

### パスの書き方

- ❌ `/js/game.js` → ルートからの絶対パス（NG）
- ✅ `js/game.js` → 相対パス（OK）

### スクリーンショット削除

不要なファイルは削除:

```bash
rm スクリーンショット*.png
git add -A
git commit -m "Remove screenshots"
git push
```

## 📞 それでも解決しない場合

1. Vercelプロジェクトを削除
2. 新規プロジェクトとして再作成
3. 設定を**全て空欄**にする
4. デプロイ

Vercelは静的サイトを自動検出するので、**設定なしが最も確実**です。
