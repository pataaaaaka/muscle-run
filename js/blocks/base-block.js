/**
 * BaseBlock.js
 * ブロックの基底クラス
 */

class BaseBlock {
  constructor(game, x, y, config = {}) {
    this.game = game;
    this.x = x;
    this.y = y;
    
    this.width = config.width || 32;
    this.height = config.height || 32;
    
    this.blockType = config.blockType || 'solid';
    
    this.isBreakable = config.isBreakable || false;
    this.isPlatform = config.isPlatform || false;
    this.isSolid = config.isSolid !== undefined ? config.isSolid : true;
    
    this.isActive = true;
    this.isBroken = false;
    this.breakTimer = 0;
    this.breakDuration = 30;
    
    this.emoji = config.emoji || '🟫';
    this.color = config.color || '#8B4513';
    this.backgroundColor = config.backgroundColor || '#654321';
    
    this.animationTimer = 0;
    this.originalY = y;
  }

  update() {
    if (!this.isActive) return;
    
    if (this.isBroken) {
      this.updateBreak();
      return;
    }
    
    this.updateAnimation();
  }

  updateAnimation() {
    this.animationTimer++;
  }

  updateBreak() {
    this.breakTimer++;
    this.y -= 2;
    
    if (this.breakTimer >= this.breakDuration) {
      this.isActive = false;
    }
  }

  checkPlayerCollision(player) {
    if (!this.isActive || this.isBroken || !this.isSolid) return null;
    
    const px = player.x, py = player.y, pw = player.width, ph = player.height;
    const bx = this.x, by = this.y, bw = this.width, bh = this.height;
    
    if (px + pw <= bx || px >= bx + bw || py + ph <= by || py >= by + bh) {
      return null;
    }
    
    const overlapLeft = (px + pw) - bx;
    const overlapRight = (bx + bw) - px;
    const overlapTop = (py + ph) - by;
    const overlapBottom = (by + bh) - py;
    
    const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
    
    if (minOverlap === overlapTop && player.vy > 0) return 'top';
    if (minOverlap === overlapBottom && player.vy < 0) return 'bottom';
    if (minOverlap === overlapLeft && player.vx > 0) return 'left';
    if (minOverlap === overlapRight && player.vx < 0) return 'right';
    
    return null;
  }

  onCollision(player, side) {
    switch (side) {
      case 'top': this.onPlayerLand(player); break;
      case 'bottom': this.onPlayerHeadbutt(player); break;
      case 'left':
      case 'right': this.onPlayerSideTouch(player, side); break;
    }
  }

  onPlayerLand(player) {
    player.y = this.y - player.height;
    player.vy = 0;
    player.onGround = true;
  }

  onPlayerHeadbutt(player) {
    player.y = this.y + this.height;
    player.vy = 0;
    
    if (this.isBreakable && player.bodyType === 'MUSCLE') {
      this.break();
    }
  }

  onPlayerSideTouch(player, side) {
    if (side === 'left') {
      player.x = this.x - player.width;
    } else {
      player.x = this.x + this.width;
    }
    player.vx = 0;
  }

  break() {
    this.isBroken = true;
    this.breakTimer = 0;
    this.isSolid = false;
    
    this.createBreakEffect();
    
    if (Math.random() < 0.7) {
      this.dropItem();
    }
    
    console.log('ブロック破壊！');
  }

  createBreakEffect() {
    if (!this.game.particleSystem) return;
    
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const speed = 3 + Math.random() * 3;
      
      this.game.particleSystem.add({
        x: this.x + this.width / 2,
        y: this.y + this.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        life: 40,
        color: this.color,
        size: 4,
        gravity: true
      });
    }
  }

  dropItem() {
    if (!this.game.itemManager) return;
    
    const itemTypes = ['coin', 'dumbbell'];
    const randomType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    const ItemClass = this.game.itemManager.getItemClass(randomType);
    
    if (ItemClass) {
      const item = this.game.itemManager.spawnItem(ItemClass, this.x + this.width / 2 - 12, this.y - 30);
      item.vy = -5;
    }
  }

  draw(ctx) {
    if (!this.isActive) return;
    
    ctx.save();
    
    if (this.isBroken) {
      ctx.globalAlpha = 1 - (this.breakTimer / this.breakDuration);
    }
    
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    if (this.emoji) {
      ctx.font = `${this.height * 0.8}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.emoji, this.x + this.width / 2, this.y + this.height / 2);
    }
    
    ctx.restore();
  }

  drawDebug(ctx) {
    if (!this.game.debug || !this.isActive) return;
    
    ctx.strokeStyle = this.isSolid ? '#00ff00' : '#ffff00';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}