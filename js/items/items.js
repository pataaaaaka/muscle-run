/**
 * Items.js
 * ゲーム内アイテム5種類
 */

// 🪙 コイン - スコア+10
class Coin extends BaseItem {
  constructor(game, x, y, fromBlock = false) {
    super(game, x, y, {
      width: 20,
      height: 20,
      scoreValue: 10,
      muscleBonus: 0,
      fatChange: 0,
      emoji: '🪙',
      color: '#FFD700',
      bounce: 0.3,
      fromBlock: fromBlock
    });
    
    this.rotationSpeed = 0.1;
    this.rotation = 0;
  }

  update() {
    super.update();
    
    // 回転アニメーション
    if (!this.isCollected) {
      this.rotation += this.rotationSpeed;
    }
  }

  draw(ctx) {
    if (!this.isActive) return;
    
    ctx.save();
    
    if (this.isCollected) {
      const scale = 1 - (this.collectedTimer / this.collectedDuration);
      ctx.globalAlpha = scale;
    } else {
      const floatY = Math.sin(this.animTimer * 0.1 + this.floatOffset) * 3;
      ctx.translate(0, floatY);
    }
    
    // 回転中心に移動
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    
    // Y軸周りの回転を模擬（横に潰す）
    const scaleX = Math.abs(Math.cos(this.rotation));
    ctx.scale(scaleX, 1);
    
    // 絵文字描画
    ctx.font = `${this.height}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.emoji, 0, 0);
    
    ctx.restore();
  }
}

// 🏋️ 鉄アレイ - MUSCLE+15, FAT-5, スコア+50, 所持数+1（投擲可能）
class Dumbbell extends BaseItem {
  constructor(game, x, y, fromBlock = false) {
    super(game, x, y, {
      width: 28,
      height: 28,
      scoreValue: 50,
      muscleBonus: 15,
      fatChange: -5,
      emoji: '🏋️',
      color: '#C0C0C0',
      bounce: 0.4,
      fromBlock: fromBlock,
      specialEffect: (player, game) => {
        // 所持数+1
        if (player.dumbbells !== undefined) {
          player.dumbbells++;
        } else {
          player.dumbbells = 1;
        }
        
        // UI更新
        if (game.updateDumbbellUI) {
          game.updateDumbbellUI();
        }
        
        console.log(`鉄アレイ所持数: ${player.dumbbells}`);
      }
    });
  }

  createCollectEffect() {
    super.createCollectEffect();
    
    // 筋肉エフェクト追加
    if (this.game.particleSystem) {
      for (let i = 0; i < 5; i++) {
        this.game.particleSystem.add({
          x: this.x + this.width / 2,
          y: this.y + this.height / 2,
          vx: (Math.random() - 0.5) * 4,
          vy: -Math.random() * 4,
          life: 30,
          color: '#ff0000',
          size: 6,
          gravity: true
        });
      }
    }
  }
}

// 🥤 プロテイン - MUSCLE+25, FAT-10, スコア+100
class Protein extends BaseItem {
  constructor(game, x, y, fromBlock = false) {
    super(game, x, y, {
      width: 26,
      height: 30,
      scoreValue: 100,
      muscleBonus: 25,
      fatChange: -10,
      emoji: '🥤',
      color: '#FF69B4',
      bounce: 0.5,
      fromBlock: fromBlock
    });
  }

  createCollectEffect() {
    super.createCollectEffect();
    
    // プロテインパワーエフェクト
    if (this.game.particleSystem) {
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI * 2 * i) / 10;
        const speed = 3;
        
        this.game.particleSystem.add({
          x: this.x + this.width / 2,
          y: this.y + this.height / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3,
          life: 35,
          color: '#FF69B4',
          size: 8,
          gravity: true
        });
      }
    }
  }
}

// 💪 ジムギア - MUSCLE+20, FAT-8, スコア+80
class GymGear extends BaseItem {
  constructor(game, x, y, fromBlock = false) {
    super(game, x, y, {
      width: 28,
      height: 28,
      scoreValue: 80,
      muscleBonus: 20,
      fatChange: -8,
      emoji: '💪',
      color: '#FFA500',
      bounce: 0.4,
      fromBlock: fromBlock
    });
    
    this.pulseTimer = 0;
  }

  update() {
    super.update();
    
    // 脈動アニメーション
    if (!this.isCollected) {
      this.pulseTimer++;
    }
  }

  draw(ctx) {
    if (!this.isActive) return;
    
    ctx.save();
    
    if (this.isCollected) {
      const scale = 1 - (this.collectedTimer / this.collectedDuration);
      ctx.globalAlpha = scale;
    } else {
      const floatY = Math.sin(this.animTimer * 0.1 + this.floatOffset) * 3;
      ctx.translate(0, floatY);
      
      // 脈動エフェクト
      const pulse = 1 + Math.sin(this.pulseTimer * 0.15) * 0.15;
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      ctx.scale(pulse, pulse);
      ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
    }
    
    ctx.font = `${this.height}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.emoji, this.x + this.width / 2, this.y + this.height / 2);
    
    ctx.restore();
  }

  createCollectEffect() {
    super.createCollectEffect();
    
    // ジムギアエフェクト
    if (this.game.particleSystem) {
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        const speed = 2.5;
        
        this.game.particleSystem.add({
          x: this.x + this.width / 2,
          y: this.y + this.height / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          life: 30,
          color: '#FFA500',
          size: 7,
          gravity: true
        });
      }
    }
  }
}

// 🔑 鍵 - 隠しステージ解放, スコア+500
class Key extends BaseItem {
  constructor(game, x, y, fromBlock = false) {
    super(game, x, y, {
      width: 24,
      height: 28,
      scoreValue: 500,
      muscleBonus: 0,
      fatChange: 0,
      emoji: '🔑',
      color: '#FFD700',
      bounce: 0.3,
      fromBlock: fromBlock,
      specialEffect: (player, game) => {
        // 隠しステージ解放
        if (game.unlockedHiddenStage !== undefined) {
          game.unlockedHiddenStage = true;
        } else {
          game.unlockedHiddenStage = true;
        }
        
        console.log('🎉 隠しステージが解放されました！');
        
        // 特別なエフェクト
        if (game.particleSystem) {
          for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 4 + Math.random() * 4;
            
            game.particleSystem.add({
              x: player.x + player.width / 2,
              y: player.y + player.height / 2,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed - 5,
              life: 50,
              color: ['#FFD700', '#FFA500', '#FFFF00'][Math.floor(Math.random() * 3)],
              size: 8,
              gravity: true
            });
          }
        }
      }
    });
    
    this.sparkleTimer = 0;
  }

  update() {
    super.update();
    
    // キラキラエフェクト生成
    if (!this.isCollected) {
      this.sparkleTimer++;
      
      if (this.sparkleTimer % 15 === 0 && this.game.particleSystem) {
        this.game.particleSystem.add({
          x: this.x + Math.random() * this.width,
          y: this.y + Math.random() * this.height,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 2,
          life: 20,
          color: '#FFFF00',
          size: 3,
          gravity: false
        });
      }
    }
  }

  draw(ctx) {
    if (!this.isActive) return;
    
    ctx.save();
    
    if (this.isCollected) {
      const scale = 1 - (this.collectedTimer / this.collectedDuration);
      ctx.globalAlpha = scale;
    } else {
      const floatY = Math.sin(this.animTimer * 0.1 + this.floatOffset) * 4;
      ctx.translate(0, floatY);
      
      // 発光エフェクト
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#FFD700';
    }
    
    ctx.font = `${this.height}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.emoji, this.x + this.width / 2, this.y + this.height / 2);
    
    ctx.restore();
  }

  createCollectEffect() {
    super.createCollectEffect();
    
    // 豪華な鍵取得エフェクト
    if (this.game.particleSystem) {
      // 大量のキラキラ
      for (let i = 0; i < 20; i++) {
        const angle = (Math.PI * 2 * i) / 20;
        const speed = 3 + Math.random() * 3;
        
        this.game.particleSystem.add({
          x: this.x + this.width / 2,
          y: this.y + this.height / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 4,
          life: 45,
          color: '#FFD700',
          size: 10,
          gravity: true
        });
      }
    }
  }
}