/**
 * BlockManager.js
 * ブロック管理システム
 */

class BlockManager {
  constructor(game) {
    this.game = game;
    this.blocks = [];
  }

  /**
   * 更新処理
   */
  update() {
    for (let i = this.blocks.length - 1; i >= 0; i--) {
      const block = this.blocks[i];
      block.update();
      
      // 非アクティブなブロックを削除
      if (!block.isActive) {
        this.blocks.splice(i, 1);
      }
    }
  }

  /**
   * ブロック生成
   */
  spawnBlock(BlockClass, x, y, ...args) {
    const block = new BlockClass(this.game, x, y, ...args);
    this.blocks.push(block);
    return block;
  }

  /**
   * プレイヤーとの衝突チェック
   */
  checkPlayerCollisions(player) {
    // 氷ブロックのフラグをリセット
    player.onIce = false;
    player.friction = player.friction || 0.8;
    
    for (const block of this.blocks) {
      const collisionSide = block.checkPlayerCollision(player);
      
      if (collisionSide) {
        block.onCollision(player, collisionSide);
      }
    }
    
    // 氷の上にいない場合は摩擦を通常に戻す
    if (!player.onIce && player.friction > 0.9) {
      player.friction = 0.8;
    }
  }

  /**
   * ブロックタイプからクラスを取得
   */
  getBlockClass(type) {
    const blockClasses = {
      'solid': SolidBlock,
      'breakable': BreakableBlock,
      'platform': PlatformBlock,
      'question': QuestionBlock,
      'ice': IceBlock,
      'trampoline': TrampolineBlock,
      'lava': LavaBlock,
      'moving_h': MovingBlockHorizontal,
      'moving_v': MovingBlockVertical,
      'disappearing': DisappearingBlock
    };
    
    return blockClasses[type];
  }

  /**
   * レベルデータからブロック生成
   */
  loadLevel(levelData) {
    this.clear();
    
    levelData.forEach(blockInfo => {
      const BlockClass = this.getBlockClass(blockInfo.type);
      if (BlockClass) {
        this.spawnBlock(BlockClass, blockInfo.x, blockInfo.y, blockInfo.distance);
      }
    });
  }

  /**
   * グリッド配置でブロック生成
   */
  createGrid(BlockClass, startX, startY, cols, rows, spacing = 40) {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = startX + col * spacing;
        const y = startY + row * spacing;
        this.spawnBlock(BlockClass, x, y);
      }
    }
  }

  /**
   * 全ブロック描画
   */
  draw(ctx) {
    for (const block of this.blocks) {
      block.draw(ctx);
      
      if (this.game.debug) {
        block.drawDebug(ctx);
      }
    }
  }

  /**
   * 全ブロッククリア
   */
  clear() {
    this.blocks = [];
  }

  /**
   * ブロック数を取得
   */
  getCount() {
    return this.blocks.filter(b => b.isActive).length;
  }

  /**
   * タイプ別ブロック数を取得
   */
  getCountByType(type) {
    return this.blocks.filter(b => b.isActive && b.blockType === type).length;
  }
}