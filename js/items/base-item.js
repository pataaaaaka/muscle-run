/**
 * BaseItem.js
 * アイテムの基底クラス
 */

class BaseItem {
  constructor(game, x, y, config = {}) {
    this.game = game;
    this.x = x;
    this.y = y;
    
    // 基本設定
    this.width = config.width || 24;
    this.height = config.height || 24;
    
    // 移動関連
    this.vx = config.vx || 0;
    this.vy = config.vy || 0;
    this.gravity = config.gravity !== undefined ? config.gravity : 0.3;
    this.bounce = config.bounce || 0.5;
    this.onGround = false;
    
    // アイテム効果
    this.scoreValue = config.scoreValue || 10;
    this.muscleBonus = config.muscleBonus || 0;
    this.fatChange = config.fatChange || 0;
    
    // 特殊効果
    this.specialEffect = config.specialEffect || null;
    
    // 状態管理
    this.isActive = true;
    this.isCollected = false;
    this.collectedTimer = 0;
    this.collectedDuration = 20;
    
    // 見た目
    this.emoji = config.emoji || '⭐';
    this.color = config.color || '#FFD700';
    
    // アニメーション
    this.animTimer = 0;
    this.floatOffset = Math.random() * Math.PI * 2;
    
    // ブロックから出現
    if (config.fromBlock) {
      this.vy = -8;
      this.vx = (Math.random() - 0.5) * 2;
    }
  }

  update() {
    if (!this.isActive) return;
    
    if (this.isCollected) {
      this.updateCollected();
      return;
    }
    
    this.animTimer++;
    this.updatePhysics();
    this.checkPlayerCollision();
    this.checkOutOfBounds();
  }

  updatePhysics() {
    if (!this.onGround) {
      this.vy += this.gravity;
      this.vy = Math.min(this.vy, 10);
    }
    
    this.x += this.vx;
    this.y += this.vy;
    
    if (this.onGround) {
      this.vx *= 0.9;
    }
    
    this.onGround = false;
    
    const groundY = this.game.canvas.height - 50 - this.height;
    if (this.y >= groundY) {
      this.y = groundY;
      this.vy = -this.vy * this.bounce;
      
      if (Math.abs(this.vy) < 1) {
        this.vy = 0;
        this.onGround = true;
      }
    }
    
    if (this.x < 0) {
      this.x = 0;
      this.vx = -this.vx * 0.5;
    }
    if (this.x + this.width > this.game.canvas.width) {
      this.x = this.game.canvas.width - this.width;
      this.vx = -this.vx * 0.5;
    }
  }

  checkPlayerCollision() {
    if (!this.game.player) return;
    
    const player = this.game.player;
    
    if (this.boxCollision(
      { x: this.x, y: this.y, width: this.width, height: this.height },
      { x: player.x, y: player.y, width: player.width, height: player.height }
    )) {
      this.collect(player);
    }
  }

  boxCollision(box1, box2) {
    return box1.x < box2.x + box2.width &&
           box1.x + box1.width > box2.x &&
           box1.y < box2.y + box2.height &&
           box1.y + box1.height > box2.y;
  }

  collect(player) {
    if (this.isCollected) return;
    
    this.isCollected = true;
    this.collectedTimer = 0;
    
    this.applyEffect(player);
    this.createCollectEffect();
    
    console.log(`${this.emoji} アイテム取得！`);
  }

  applyEffect(player) {
    if (this.scoreValue > 0) {
      this.game.addScore(this.scoreValue);
    }
    
    if (this.muscleBonus !== 0) {
      player.addMuscle(this.muscleBonus);
    }
    
    if (this.fatChange !== 0) {
      player.addFat(this.fatChange);
    }
    
    if (this.specialEffect) {
      this.specialEffect(player, this.game);
    }
  }

  updateCollected() {
    this.collectedTimer++;
    
    if (this.game.player) {
      const dx = this.game.player.x + this.game.player.width / 2 - (this.x + this.width / 2);
      const dy = this.game.player.y + this.game.player.height / 2 - (this.y + this.height / 2);
      
      this.x += dx * 0.3;
      this.y += dy * 0.3;
    }
    
    if (this.collectedTimer >= this.collectedDuration) {
      this.isActive = false;
    }
  }

  createCollectEffect() {
    if (!this.game.particleSystem) return;
    
    const particleCount = 8;
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 2 + Math.random() * 2;
      
      this.game.particleSystem.add({
        x: this.x + this.width / 2,
        y: this.y + this.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 25,
        color: this.color,
        size: 4,
        gravity: true
      });
    }
  }

  checkOutOfBounds() {
    const buffer = 100;
    if (this.y > this.game.canvas.height + buffer) {
      this.isActive = false;
    }
  }

  draw(ctx) {
    if (!this.isActive) return;
    
    ctx.save();
    
    if (this.isCollected) {
      const scale = 1 - (this.collectedTimer / this.collectedDuration);
      ctx.globalAlpha = scale;
      
      const centerX = this.x + this.width / 2;
      const centerY = this.y + this.height / 2;
      
      ctx.translate(centerX, centerY);
      ctx.scale(scale, scale);
      ctx.translate(-centerX, -centerY);
    } else {
      const floatY = Math.sin(this.animTimer * 0.1 + this.floatOffset) * 3;
      ctx.translate(0, floatY);
    }
    
    ctx.font = `${this.height}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.emoji, this.x + this.width / 2, this.y + this.height / 2);
    
    ctx.restore();
    
    if (this.game.debug && !this.isCollected) {
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 1;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }
}