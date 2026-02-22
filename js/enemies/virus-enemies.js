/**
 * VirusEnemies.js
 * ウイルス/病原菌系の敵5種類
 */

// 🦠 ウイルス - HP1, ランダムに動く
class Virus extends BaseEnemy {
  constructor(game, x, y) {
    super(game, x, y, {
      width: 30,
      height: 30,
      hp: 1,
      vx: 0,
      vy: 0,
      speed: 2,
      gravity: 0,
      type: 'virus',
      emoji: '🦠',
      color: '#00FF00',
      scoreValue: 150,
      muscleReward: 15,
      fatPenalty: 5,
      canBeStomped: true,
      canFly: true,
      aiInterval: 30
    });
    
    this.changeDirectionTimer = 0;
  }

  updateAI() {
    super.updateAI();
    
    this.changeDirectionTimer++;
    
    // ランダムに方向転換
    if (this.changeDirectionTimer >= this.aiInterval) {
      this.changeDirectionTimer = 0;
      
      const angle = Math.random() * Math.PI * 2;
      this.vx = Math.cos(angle) * this.speed;
      this.vy = Math.sin(angle) * this.speed;
    }
  }

  updatePhysics() {
    // 重力なし
    this.x += this.vx;
    this.y += this.vy;
  }

  checkCollisions() {
    const canvas = this.game.canvas || {width:800, height:600};
    const margin = 50;
    
    // 画面端で反転
    if (this.x < margin) {
      this.x = margin;
      this.vx = Math.abs(this.vx);
    }
    if (this.x + this.width > canvas.width - margin) {
      this.x = canvas.width - margin - this.width;
      this.vx = -Math.abs(this.vx);
    }
    if (this.y < margin) {
      this.y = margin;
      this.vy = Math.abs(this.vy);
    }
    if (this.y + this.height > canvas.height - margin) {
      this.y = canvas.height - margin - this.height;
      this.vy = -Math.abs(this.vy);
    }
  }
}

// 🧪 バクテリア - HP2, 分裂（ダメージ時）
class Bacteria extends BaseEnemy {
  constructor(game, x, y) {
    super(game, x, y, {
      width: 32,
      height: 32,
      hp: 2,
      vx: -1,
      speed: 1,
      type: 'virus',
      emoji: '🧪',
      color: '#9370DB',
      scoreValue: 250,
      muscleReward: 15,
      fatPenalty: 5,
      canBeStomped: true
    });
    
    this.canSplit = true; // 1回のみ分裂可能
  }

  updateAI() {
    super.updateAI();
    
    this.vx = this.direction * this.speed;
  }

  onDamaged(damage, source) {
    super.onDamaged(damage, source);
    
    // ダメージを受けたら分裂
    if (this.canSplit && this.hp > 0) {
      this.split();
      this.canSplit = false;
    }
  }

  split() {
    // 小さなバクテリアを2体生成
    const offset = 20;
    
    // 左側
    const bacteria1 = new SmallBacteria(this.game, this.x - offset, this.y);
    bacteria1.vx = -2;
    bacteria1.vy = -3;
    
    // 右側
    const bacteria2 = new SmallBacteria(this.game, this.x + offset, this.y);
    bacteria2.vx = 2;
    bacteria2.vy = -3;
    
    if (this.game.enemies) {
      this.game.enemies.push(bacteria1);
      this.game.enemies.push(bacteria2);
    }
  }
}

// 小さなバクテリア（分裂後）
class SmallBacteria extends BaseEnemy {
  constructor(game, x, y) {
    super(game, x, y, {
      width: 20,
      height: 20,
      hp: 1,
      vx: -1.5,
      speed: 1.5,
      type: 'virus',
      emoji: '🧪',
      color: '#9370DB',
      scoreValue: 100,
      muscleReward: 15,
      fatPenalty: 3,
      canBeStomped: true
    });
  }

  updateAI() {
    super.updateAI();
    this.vx = this.direction * this.speed;
  }
}

// 🍄 毒キノコ - HP2, 毒を撒き散らす
class PoisonMushroom extends BaseEnemy {
  constructor(game, x, y) {
    super(game, x, y, {
      width: 32,
      height: 32,
      hp: 2,
      vx: -0.8,
      speed: 0.8,
      type: 'virus',
      enemyClass: 'poison',
      emoji: '🍄',
      color: '#8B008B',
      scoreValue: 300,
      muscleReward: 15,
      fatPenalty: 10,
      canBeStomped: false, // 毒なので踏めない
      isPoisonous: true,
      aiInterval: 120
    });
    
    this.poisonTimer = 0;
  }

  updateAI() {
    super.updateAI();
    
    this.vx = this.direction * this.speed;
    
    // 定期的に毒を撒く
    this.poisonTimer++;
    if (this.poisonTimer >= this.aiInterval) {
      this.poisonTimer = 0;
      this.spawnPoison();
    }
  }

  spawnPoison() {
    // 毒雲を生成
    const poison = {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
      vx: 0,
      vy: -0.5,
      life: 60,
      color: '#9370DB',
      size: 8,
      damage: 1,
      type: 'poison'
    };
    
    if (this.game.particles) {
      this.game.particles.push(poison);
    }
  }

  draw(ctx) {
    super.draw(ctx);
    
    // 毒のオーラ描画
    if (!this.isDying && this.isAlive) {
      ctx.save();
      ctx.globalAlpha = 0.3 + Math.sin(this.aiTimer * 0.1) * 0.2;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.width / 2 + 8,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();
    }
  }
}

// 🕷️ 病原体 - HP1, 壁を登る
class Pathogen extends BaseEnemy {
  constructor(game, x, y) {
    super(game, x, y, {
      width: 28,
      height: 28,
      hp: 1,
      vx: -1.5,
      vy: 0,
      speed: 1.5,
      gravity: 0,
      type: 'virus',
      emoji: '🕷️',
      color: '#8B0000',
      scoreValue: 180,
      muscleReward: 15,
      fatPenalty: 5,
      canBeStomped: true,
      canClimbWalls: true
    });
    
    this.climbState = 'ground'; // 'ground', 'wall', 'ceiling'
    this.climbDirection = 1; // 1: 上, -1: 下
  }

  updateAI() {
    super.updateAI();
    
    // 壁を這う動き
    switch (this.climbState) {
      case 'ground':
        this.vx = this.direction * this.speed;
        this.vy = 0;
        break;
      case 'wall':
        this.vx = 0;
        this.vy = this.climbDirection * this.speed;
        break;
      case 'ceiling':
        this.vx = -this.direction * this.speed;
        this.vy = 0;
        break;
    }
  }

  checkCollisions() {
    const canvas = this.game.canvas || {width:800, height:600};
    const margin = 50;
    
    // 地面
    if (this.y + this.height >= canvas.height - margin && this.climbState === 'ground') {
      this.y = canvas.height - margin - this.height;
      this.onGround = true;
    }
    
    // 壁に到達したら登り始める
    if (this.x <= 0 && this.climbState === 'ground') {
      this.climbState = 'wall';
      this.climbDirection = -1; // 上に登る
    }
    
    // 天井に到達
    if (this.y <= margin && this.climbState === 'wall') {
      this.climbState = 'ceiling';
    }
    
    // 天井から壁へ
    if (this.x + this.width >= canvas.width && this.climbState === 'ceiling') {
      this.climbState = 'wall';
      this.climbDirection = 1; // 下に降りる
    }
    
    // 壁から地面へ
    if (this.y + this.height >= canvas.height - margin && this.climbState === 'wall') {
      this.climbState = 'ground';
    }
  }
}

// 💀 腐敗菌 - HP3, プレイヤーを追跡
class DecayGerm extends BaseEnemy {
  constructor(game, x, y) {
    super(game, x, y, {
      width: 34,
      height: 34,
      hp: 3,
      vx: 0,
      vy: 0,
      speed: 1.2,
      gravity: 0.3,
      type: 'virus',
      emoji: '💀',
      color: '#2F4F2F',
      scoreValue: 400,
      muscleReward: 15,
      fatPenalty: 8,
      canBeStomped: true,
      aiInterval: 20
    });
    
    this.trackingSpeed = 0.1; // 追跡の滑らかさ
  }

  updateAI() {
    super.updateAI();
    
    // プレイヤーを追跡
    if (this.game.player && this.aiTimer % 10 === 0) {
      const dx = this.game.player.x - this.x;
      const dy = this.game.player.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 10) {
        // プレイヤー方向へ移動
        const targetVx = (dx / distance) * this.speed;
        const targetVy = (dy / distance) * this.speed * 0.3; // 縦方向は弱め
        
        // 滑らかに加速
        this.vx += (targetVx - this.vx) * this.trackingSpeed;
        this.vy += (targetVy - this.vy) * this.trackingSpeed;
        
        // 方向更新
        this.direction = this.vx > 0 ? 1 : -1;
      }
    }
    
    // 速度制限
    const maxSpeed = this.speed * 1.5;
    const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (currentSpeed > maxSpeed) {
      this.vx = (this.vx / currentSpeed) * maxSpeed;
      this.vy = (this.vy / currentSpeed) * maxSpeed;
    }
  }

  draw(ctx) {
    super.draw(ctx);
    
    // 追跡オーラ描画
    if (!this.isDying && this.isAlive && this.game.player) {
      const dx = this.game.player.x - this.x;
      const dy = this.game.player.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 200) {
        ctx.save();
        ctx.globalAlpha = 0.2;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
        ctx.lineTo(this.game.player.x + this.game.player.width / 2, this.game.player.y + this.game.player.height / 2);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}