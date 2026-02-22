/**
 * Blocks.js
 * 基本ブロック3種類 + 追加ブロック6種類
 */

// === 基本ブロック ===

// 1. 壊せないブロック
class SolidBlock extends BaseBlock {
  constructor(game, x, y) {
    super(game, x, y, {
      blockType: 'solid',
      emoji: '🟫',
      color: '#8B4513',
      backgroundColor: '#A0522D',
      isBreakable: false
    });
  }
}

// 2. 壊せるブロック (MUSCLE体型で頭突きで破壊)
class BreakableBlock extends BaseBlock {
  constructor(game, x, y) {
    super(game, x, y, {
      blockType: 'breakable',
      emoji: '📦',
      color: '#CD853F',
      backgroundColor: '#DEB887',
      isBreakable: true
    });
  }
}

// 3. 足場ブロック (下からすり抜け可能)
class PlatformBlock extends BaseBlock {
  constructor(game, x, y) {
    super(game, x, y, {
      blockType: 'platform',
      emoji: '━',
      color: '#696969',
      backgroundColor: '#808080',
      isPlatform: true,
      height: 8
    });
  }

  checkPlayerCollision(player) {
    if (!this.isActive || this.isBroken) return null;
    
    // プレイヤーが下から来ている場合はすり抜け
    if (player.vy < 0) return null;
    
    // プレイヤーがブロックより上にいる場合のみ衝突
    if (player.y + player.height > this.y + this.height) return null;
    
    const px = player.x, py = player.y, pw = player.width, ph = player.height;
    const bx = this.x, by = this.y, bw = this.width;
    
    if (px + pw > bx && px < bx + bw && py + ph >= by && py + ph <= by + this.height + 10) {
      return 'top';
    }
    
    return null;
  }
}

// === 追加ブロック ===

// 4. ❓ ハテナブロック
class QuestionBlock extends BaseBlock {
  constructor(game, x, y) {
    super(game, x, y, {
      blockType: 'question',
      emoji: '❓',
      color: '#FFD700',
      backgroundColor: '#FFA500',
      isBreakable: false
    });
    
    this.hasItem = true;
    this.bounceOffset = 0;
    this.isBouncing = false;
  }

  updateAnimation() {
    super.updateAnimation();
    
    // バウンドアニメーション
    if (this.isBouncing) {
      this.bounceOffset = Math.max(0, this.bounceOffset - 1);
      this.y = this.originalY - this.bounceOffset;
      
      if (this.bounceOffset === 0) {
        this.isBouncing = false;
      }
    }
  }

  onPlayerHeadbutt(player) {
    super.onPlayerHeadbutt(player);
    
    if (this.hasItem) {
      this.hasItem = false;
      this.emoji = '□';
      this.backgroundColor = '#888888';
      
      // バウンドアニメーション
      this.isBouncing = true;
      this.bounceOffset = 10;
      
      // アイテム出現
      this.spawnRandomItem();
    }
  }

  spawnRandomItem() {
    if (!this.game.itemManager) return;
    
    const itemTypes = ['coin', 'dumbbell', 'protein', 'gymgear'];
    const weights = [50, 30, 15, 5]; // 確率の重み
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    
    let random = Math.random() * totalWeight;
    let selectedType = itemTypes[0];
    
    for (let i = 0; i < itemTypes.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        selectedType = itemTypes[i];
        break;
      }
    }
    
    const ItemClass = this.game.itemManager.getItemClass(selectedType);
    if (ItemClass) {
      const item = this.game.itemManager.spawnItem(ItemClass, this.x + this.width / 2 - 12, this.y - 30);
      item.vy = -5;
      console.log(`ハテナブロック: ${selectedType} 出現！`);
    }
  }
}

// 5. 🧊 氷ブロック
class IceBlock extends BaseBlock {
  constructor(game, x, y) {
    super(game, x, y, {
      blockType: 'ice',
      emoji: '🧊',
      color: '#B0E0E6',
      backgroundColor: '#E0FFFF',
      isBreakable: false
    });
  }

  onPlayerLand(player) {
    super.onPlayerLand(player);
    
    // 摩擦を設定（FAT体型は滑りにくい）
    player.friction = player.bodyType === 'FAT' ? 0.9 : 0.98;
    player.onIce = true;
  }

  draw(ctx) {
    super.draw(ctx);
    
    // 氷の光沢エフェクト
    if (this.isActive && !this.isBroken) {
      ctx.save();
      ctx.globalAlpha = 0.3 + Math.sin(this.animationTimer * 0.1) * 0.2;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(this.x + 2, this.y + 2, this.width - 4, 4);
      ctx.restore();
    }
  }
}

// 6. 🌀 トランポリン
class TrampolineBlock extends BaseBlock {
  constructor(game, x, y) {
    super(game, x, y, {
      blockType: 'trampoline',
      emoji: '🌀',
      color: '#FF69B4',
      backgroundColor: '#FFB6C1',
      isBreakable: false
    });
    
    this.bounceOffset = 0;
    this.isBouncing = false;
  }

  updateAnimation() {
    super.updateAnimation();
    
    // バウンドアニメーション
    if (this.isBouncing) {
      this.bounceOffset = Math.max(0, this.bounceOffset - 1);
      if (this.bounceOffset === 0) {
        this.isBouncing = false;
      }
    }
  }

  onPlayerLand(player) {
    // 超高ジャンプ
    player.y = this.y - player.height;
    player.vy = -20;
    player.onGround = false;
    
    // バウンドアニメーション
    this.isBouncing = true;
    this.bounceOffset = 8;
    
    console.log('トランポリンで超ジャンプ！');
  }

  draw(ctx) {
    ctx.save();
    
    // バウンド時に圧縮される
    const squash = this.isBouncing ? 1 - (this.bounceOffset / 16) : 1;
    
    ctx.translate(this.x + this.width / 2, this.y + this.height);
    ctx.scale(1 + (1 - squash) * 0.2, squash);
    ctx.translate(-(this.x + this.width / 2), -(this.y + this.height));
    
    super.draw(ctx);
    
    ctx.restore();
  }
}

// 7. 🔥 溶岩ブロック
class LavaBlock extends BaseBlock {
  constructor(game, x, y) {
    super(game, x, y, {
      blockType: 'lava',
      emoji: '🔥',
      color: '#FF4500',
      backgroundColor: '#FF6347',
      isBreakable: false
    });
    
    this.damageTimer = 0;
    this.damageInterval = 30; // 0.5秒ごと
  }

  updateAnimation() {
    super.updateAnimation();
    this.damageTimer++;
  }

  checkPlayerCollision(player) {
    const collision = super.checkPlayerCollision(player);
    
    if (collision && !player.isInvincible) {
      // 継続ダメージ
      if (this.damageTimer >= this.damageInterval) {
        this.damageTimer = 0;
        player.takeDamage(1);
        console.log('溶岩ダメージ！');
      }
    }
    
    return collision;
  }

  draw(ctx) {
    super.draw(ctx);
    
    // 炎のアニメーション
    if (this.isActive && !this.isBroken) {
      ctx.save();
      
      const flameIntensity = 0.5 + Math.sin(this.animationTimer * 0.2) * 0.3;
      ctx.globalAlpha = flameIntensity;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#FF4500';
      
      // 揺らめく炎
      const offset = Math.sin(this.animationTimer * 0.15) * 2;
      ctx.fillStyle = '#FF6347';
      ctx.fillRect(this.x + offset, this.y, this.width, this.height);
      
      ctx.restore();
    }
  }
}

// 8. ⬌⬍ 動くブロック (横移動)
class MovingBlockHorizontal extends BaseBlock {
  constructor(game, x, y, distance = 100) {
    super(game, x, y, {
      blockType: 'moving_h',
      emoji: '⬌',
      color: '#4169E1',
      backgroundColor: '#6495ED',
      isBreakable: false
    });
    
    this.startX = x;
    this.endX = x + distance;
    this.speed = 1.5;
    this.direction = 1;
  }

  updateAnimation() {
    super.updateAnimation();
    
    // 往復移動
    this.x += this.speed * this.direction;
    
    if (this.x >= this.endX) {
      this.x = this.endX;
      this.direction = -1;
    } else if (this.x <= this.startX) {
      this.x = this.startX;
      this.direction = 1;
    }
  }

  onPlayerLand(player) {
    super.onPlayerLand(player);
    
    // プレイヤーをブロックと一緒に移動
    player.x += this.speed * this.direction;
  }
}

// 9. 動くブロック (縦移動)
class MovingBlockVertical extends BaseBlock {
  constructor(game, x, y, distance = 100) {
    super(game, x, y, {
      blockType: 'moving_v',
      emoji: '⬍',
      color: '#32CD32',
      backgroundColor: '#90EE90',
      isBreakable: false
    });
    
    this.startY = y;
    this.endY = y + distance;
    this.speed = 1.5;
    this.direction = 1;
  }

  updateAnimation() {
    super.updateAnimation();
    
    // 往復移動
    this.y += this.speed * this.direction;
    
    if (this.y >= this.endY) {
      this.y = this.endY;
      this.direction = -1;
    } else if (this.y <= this.startY) {
      this.y = this.startY;
      this.direction = 1;
    }
  }

  onPlayerLand(player) {
    // プレイヤーの位置を更新
    player.y = this.y - player.height;
    player.vy = this.speed * this.direction;
    player.onGround = true;
  }
}

// 10. ◻️ 消えるブロック
class DisappearingBlock extends BaseBlock {
  constructor(game, x, y) {
    super(game, x, y, {
      blockType: 'disappearing',
      emoji: '◻️',
      color: '#9370DB',
      backgroundColor: '#DDA0DD',
      isBreakable: false
    });
    
    this.solidDuration = 120; // 2秒
    this.invisibleDuration = 120; // 2秒
    this.warningDuration = 30; // 0.5秒（点滅開始）
    
    this.cycleTimer = 0;
    this.isSolid = true;
  }

  updateAnimation() {
    super.updateAnimation();
    
    this.cycleTimer++;
    
    const totalCycle = this.solidDuration + this.invisibleDuration;
    const cyclePosition = this.cycleTimer % totalCycle;
    
    // 固体 → 消失のサイクル
    if (cyclePosition < this.solidDuration) {
      this.isSolid = true;
    } else {
      this.isSolid = false;
    }
  }

  draw(ctx) {
    if (!this.isActive) return;
    
    const totalCycle = this.solidDuration + this.invisibleDuration;
    const cyclePosition = this.cycleTimer % totalCycle;
    
    // 消失状態では描画しない
    if (!this.isSolid && cyclePosition >= this.solidDuration + 10) {
      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = this.color;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      ctx.restore();
      return;
    }
    
    // 点滅警告
    const timeUntilDisappear = this.solidDuration - cyclePosition;
    if (this.isSolid && timeUntilDisappear > 0 && timeUntilDisappear <= this.warningDuration) {
      const blinkSpeed = 5;
      if (Math.floor(this.cycleTimer / blinkSpeed) % 2 === 0) {
        ctx.globalAlpha = 0.5;
      }
    }
    
    super.draw(ctx);
  }
}