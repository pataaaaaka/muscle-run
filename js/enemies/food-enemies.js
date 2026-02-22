/**
 * FoodEnemies.js
 * 食べ物系の敵5種類
 */

// 🍔 ハンバーガー - HP1, 地上を歩く
class Hamburger extends BaseEnemy {
  constructor(game, x, y) {
    super(game, x, y, {
      width: 32,
      height: 32,
      hp: 1,
      vx: -1,
      speed: 1,
      type: 'food',
      emoji: '🍔',
      color: '#D2691E',
      scoreValue: 100,
      muscleReward: 10,
      fatPenalty: 5,
      canBeStomped: true
    });
  }

  updateAI() {
    super.updateAI();
    
    // シンプルに左右に歩く
    this.vx = this.direction * this.speed;
  }
}

// 🍟 フライドポテト - HP1, ジャンプして襲う
class FrenchFries extends BaseEnemy {
  constructor(game, x, y) {
    super(game, x, y, {
      width: 28,
      height: 32,
      hp: 1,
      vx: -1.2,
      speed: 1.2,
      type: 'food',
      emoji: '🍟',
      color: '#FFD700',
      scoreValue: 120,
      muscleReward: 10,
      fatPenalty: 5,
      canBeStomped: true,
      aiInterval: 90
    });
    
    this.jumpCooldown = 0;
  }

  updateAI() {
    super.updateAI();
    
    this.vx = this.direction * this.speed;
    
    // ジャンプ攻撃
    if (this.jumpCooldown > 0) {
      this.jumpCooldown--;
    }
    
    if (this.onGround && this.jumpCooldown === 0) {
      // プレイヤーが近くにいたらジャンプ
      if (this.game.player) {
        const dx = this.game.player.x - this.x;
        const dy = this.game.player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150 && Math.abs(dy) < 100) {
          this.vy = -7;
          this.jumpCooldown = 120; // 2秒クールダウン
        }
      }
    }
  }
}

// 🍕 ピザ - HP2, 回転しながら移動
class Pizza extends BaseEnemy {
  constructor(game, x, y) {
    super(game, x, y, {
      width: 36,
      height: 36,
      hp: 2,
      vx: -1.5,
      speed: 1.5,
      type: 'food',
      emoji: '🍕',
      color: '#FF6347',
      scoreValue: 200,
      muscleReward: 10,
      fatPenalty: 8,
      canBeStomped: true
    });
    
    this.rotationSpeed = 0.1;
  }

  updateAI() {
    super.updateAI();
    
    this.vx = this.direction * this.speed;
    
    // 回転
    this.rotation += this.rotationSpeed * this.direction;
  }
}

// 🍩 ドーナツ - HP1, 転がってくる
class Donut extends BaseEnemy {
  constructor(game, x, y) {
    super(game, x, y, {
      width: 30,
      height: 30,
      hp: 1,
      vx: -2,
      speed: 2,
      type: 'food',
      emoji: '🍩',
      color: '#FF69B4',
      scoreValue: 150,
      muscleReward: 10,
      fatPenalty: 6,
      canBeStomped: true
    });
    
    this.rotationSpeed = 0.15;
  }

  updateAI() {
    super.updateAI();
    
    this.vx = this.direction * this.speed;
    
    // 転がる動き
    if (this.onGround) {
      this.rotation += this.rotationSpeed * this.direction;
    }
  }

  checkCollisions() {
    super.checkCollisions();
    
    // 壁に当たったら反転
    if (this.x <= 0 || this.x + this.width >= this.game.canvas.width) {
      this.direction *= -1;
    }
  }
}

// 🧃 ソーダ - HP1, 上下に浮遊
class Soda extends BaseEnemy {
  constructor(game, x, y) {
    super(game, x, y, {
      width: 28,
      height: 32,
      hp: 1,
      vx: -0.8,
      vy: 0,
      speed: 0.8,
      gravity: 0, // 浮遊するので重力なし
      type: 'food',
      emoji: '🧃',
      color: '#87CEEB',
      scoreValue: 130,
      muscleReward: 10,
      fatPenalty: 5,
      canBeStomped: true,
      canFly: true
    });
    
    this.floatAmplitude = 40; // 上下移動の幅
    this.floatSpeed = 0.05;
    this.floatOffset = Math.random() * Math.PI * 2; // ランダムな初期位相
    this.baseY = y;
  }

  updateAI() {
    super.updateAI();
    
    // 左右移動
    this.vx = this.direction * this.speed;
    
    // 上下に波動移動
    const floatY = Math.sin(this.aiTimer * this.floatSpeed + this.floatOffset) * this.floatAmplitude;
    this.y = this.baseY + floatY;
  }

  updatePhysics() {
    // 重力を無視
    this.x += this.vx;
    // y座標はupdateAIで制御
  }

  checkCollisions() {
    // 壁判定のみ
    if (this.x < 0) {
      this.x = 0;
      this.direction = 1;
    }
    if (this.x + this.width > this.game.canvas.width) {
      this.x = this.game.canvas.width - this.width;
      this.direction = -1;
    }
  }
}