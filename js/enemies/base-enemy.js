/**
 * BaseEnemy.js
 * 敵キャラクターの基底クラス
 */

class BaseEnemy {
  constructor(game, x, y, config = {}) {
    this.game = game;
    this.x = x;
    this.y = y;
    
    // 基本設定
    this.width = config.width || 32;
    this.height = config.height || 32;
    this.hp = config.hp || 1;
    this.maxHp = this.hp;
    
    // 移動関連
    this.vx = config.vx || -1;
    this.vy = config.vy || 0;
    this.speed = config.speed || 1;
    this.gravity = config.gravity !== undefined ? config.gravity : 0.5;
    this.onGround = false;
    
    // 敵タイプ
    this.type = config.type || 'food'; // 'food' or 'virus'
    this.enemyClass = config.enemyClass || 'normal'; // 'normal', 'poison', 'boss'
    
    // 特性
    this.canBeStomped = config.canBeStomped !== undefined ? config.canBeStomped : true;
    this.isPoisonous = config.isPoisonous || false;
    this.canClimbWalls = config.canClimbWalls || false;
    this.canFly = config.canFly || false;
    
    // スコア・ゲージ報酬
    this.scoreValue = config.scoreValue || 100;
    this.muscleReward = config.muscleReward || (this.type === 'virus' ? 15 : 10);
    this.fatPenalty = config.fatPenalty || 5;
    
    // 状態管理
    this.isAlive = true;
    this.isDying = false;
    this.deathTimer = 0;
    this.deathDuration = 30; // 30フレーム
    
    // 見た目
    this.emoji = config.emoji || '👾';
    this.color = config.color || '#ff0000';
    this.rotation = 0;
    
    // AI・行動
    this.aiTimer = 0;
    this.aiInterval = config.aiInterval || 60;
    this.direction = -1; // -1: 左, 1: 右
  }

  update() {
    if (!this.isAlive) return;
    
    if (this.isDying) {
      this.updateDeath();
      return;
    }
    
    this.updateAI();
    this.updatePhysics();
    this.checkCollisions();
    this.checkOutOfBounds();
  }

  updateAI() {
    this.aiTimer++;
  }

  updatePhysics() {
    if (!this.canFly && !this.onGround) {
      this.vy += this.gravity;
      this.vy = Math.min(this.vy, 10);
    }
    
    this.x += this.vx;
    this.y += this.vy;
    
    this.onGround = false;
  }

  checkCollisions() {
    const canvas = this.game.canvas || {width:800, height:600};
    
    if (this.y + this.height >= canvas.height - 50) {
      this.y = canvas.height - 50 - this.height;
      this.vy = 0;
      this.onGround = true;
    }
    
    if (this.x < 0) {
      this.x = 0;
      this.direction = 1;
      this.vx = Math.abs(this.vx);
    }
    if (this.x + this.width > canvas.width) {
      this.x = canvas.width - this.width;
      this.direction = -1;
      this.vx = -Math.abs(this.vx);
    }
  }

  checkOutOfBounds() {
    const buffer = 100;
    if (this.y > this.game.canvas.height + buffer) {
      this.isAlive = false;
    }
  }

  takeDamage(damage = 1, source = 'stomp') {
    if (this.isDying) return false;
    
    this.hp -= damage;
    
    if (this.hp <= 0) {
      this.die(source);
      return true;
    } else {
      this.onDamaged(damage, source);
      return false;
    }
  }

  onDamaged(damage, source) {
    // オーバーライド用
  }

  die(source = 'stomp') {
    this.isDying = true;
    this.deathTimer = 0;
    
    this.game.addScore(this.scoreValue);
    
    if (source === 'stomp') {
      this.game.addMuscle(this.muscleReward);
    }
    
    this.createDeathParticles();
  }

  updateDeath() {
    this.deathTimer++;
    this.y -= 2;
    this.rotation += 0.2;
    
    if (this.deathTimer >= this.deathDuration) {
      this.isAlive = false;
    }
  }

  createDeathParticles() {
    const particleCount = 8;
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 3;
      const particle = {
        x: this.x + this.width / 2,
        y: this.y + this.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 30,
        color: this.color,
        size: 4
      };
      
      if (this.game.particles) {
        this.game.particles.push(particle);
      }
    }
  }

  checkPlayerCollision(player) {
    if (!this.isAlive || this.isDying) return null;
    
    const playerBox = {
      x: player.x,
      y: player.y,
      width: player.width,
      height: player.height
    };
    
    const enemyBox = {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
    
    if (this.boxCollision(playerBox, enemyBox)) {
      if (player.vy > 0 && player.y + player.height - 10 < this.y + this.height / 2) {
        return 'stomp';
      } else {
        return 'touch';
      }
    }
    
    return null;
  }

  boxCollision(box1, box2) {
    return box1.x < box2.x + box2.width &&
           box1.x + box1.width > box2.x &&
           box1.y < box2.y + box2.height &&
           box1.y + box1.height > box2.y;
  }

  onStomped(player) {
    if (!this.canBeStomped) {
      return false;
    }
    
    if (this.type === 'virus' && player.bodyType !== 'MUSCLE' && player.bodyType !== 'NORMAL') {
      return false;
    }
    
    this.takeDamage(1, 'stomp');
    player.vy = -8;
    
    return true;
  }

  onTouched(player) {
    if (player.isInvincible) return;
    
    player.takeDamage(1);
    
    if (this.type === 'food') {
      player.addFat(this.fatPenalty);
    } else if (this.type === 'virus') {
      player.addMuscle(-this.fatPenalty);
    }
    
    const knockbackDirection = player.x < this.x ? -1 : 1;
    player.vx = knockbackDirection * 5;
    player.vy = -5;
  }

  onHitByDumbbell(dumbbell) {
    this.takeDamage(1, 'dumbbell');
    return true;
  }

  draw(ctx) {
    if (!this.isAlive) return;
    
    ctx.save();
    
    if (this.isDying) {
      ctx.globalAlpha = 1 - (this.deathTimer / this.deathDuration);
    }
    
    if (this.rotation !== 0) {
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      ctx.rotate(this.rotation);
      ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
    }
    
    ctx.font = `${this.height}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.emoji, this.x + this.width / 2, this.y + this.height / 2);
    
    if (this.game.debug && this.hp < this.maxHp && !this.isDying) {
      this.drawHPBar(ctx);
    }
    
    ctx.restore();
  }

  drawHPBar(ctx) {
    const barWidth = this.width;
    const barHeight = 4;
    const barX = this.x;
    const barY = this.y - 8;
    
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(barX, barY, (this.hp / this.maxHp) * barWidth, barHeight);
  }

  drawDebug(ctx) {
    if (!this.game.debug || !this.isAlive) return;
    
    ctx.strokeStyle = this.isPoisonous ? '#ff00ff' : '#ff0000';
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px Arial';
    ctx.fillText(`HP:${this.hp}`, this.x, this.y - 12);
  }
}