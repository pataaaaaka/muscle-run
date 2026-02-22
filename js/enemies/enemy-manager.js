/**
 * EnemyManager.js
 * 敵の生成・管理システム
 */

class EnemyManager {
  constructor(game) {
    this.game = game;
    this.enemies = [];
    this.spawnTimer = 0;
    this.spawnInterval = 180; // 3秒ごとにスポーン
    this.maxEnemies = 10;
    
    // 敵の種類別の生成確率
    this.enemyTypes = [
      { class: Hamburger, weight: 15 },
      { class: FrenchFries, weight: 12 },
      { class: Pizza, weight: 8 },
      { class: Donut, weight: 12 },
      { class: Soda, weight: 10 },
      { class: Virus, weight: 12 },
      { class: Bacteria, weight: 8 },
      { class: PoisonMushroom, weight: 5 },
      { class: Pathogen, weight: 10 },
      { class: DecayGerm, weight: 8 }
    ];
    
    // 重みの合計を計算
    this.totalWeight = this.enemyTypes.reduce((sum, type) => sum + type.weight, 0);
  }

  /**
   * 更新処理
   */
  update() {
    // 敵のスポーン
    this.spawnTimer++;
    if (this.spawnTimer >= this.spawnInterval && this.enemies.length < this.maxEnemies) {
      this.spawnTimer = 0;
      this.spawnRandomEnemy();
    }
    
    // 全敵の更新
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update();
      
      // 死んだ敵を削除
      if (!enemy.isAlive) {
        this.enemies.splice(i, 1);
      }
    }
  }

  /**
   * ランダムな敵を生成
   */
  spawnRandomEnemy() {
    // 重み付きランダム選択
    let random = Math.random() * this.totalWeight;
    let selectedType = this.enemyTypes[0];
    
    for (const type of this.enemyTypes) {
      random -= type.weight;
      if (random <= 0) {
        selectedType = type;
        break;
      }
    }
    
    // スポーン位置を決定
    const spawnX = this.game.canvas.width + 50;
    const spawnY = Math.random() * (this.game.canvas.height - 200) + 50;
    
    // 敵を生成
    const enemy = new selectedType.class(this.game, spawnX, spawnY);
    this.enemies.push(enemy);
  }

  /**
   * 特定の敵を生成
   */
  spawnEnemy(EnemyClass, x, y) {
    const enemy = new EnemyClass(this.game, x, y);
    this.enemies.push(enemy);
    return enemy;
  }

  /**
   * プレイヤーとの衝突チェック
   */
  checkPlayerCollisions(player) {
    for (const enemy of this.enemies) {
      const collisionType = enemy.checkPlayerCollision(player);
      
      if (collisionType === 'stomp') {
        enemy.onStomped(player);
      } else if (collisionType === 'touch') {
        enemy.onTouched(player);
      }
    }
  }

  /**
   * 鉄アレイとの衝突チェック
   */
  checkDumbbellCollisions(dumbbells) {
    for (const dumbbell of dumbbells) {
      if (!dumbbell.active) continue;
      
      for (const enemy of this.enemies) {
        if (!enemy.isAlive || enemy.isDying) continue;
        
        // 衝突判定
        if (this.boxCollision(dumbbell, enemy)) {
          enemy.onHitByDumbbell(dumbbell);
          dumbbell.active = false;
          break;
        }
      }
    }
  }

  /**
   * 矩形衝突判定
   */
  boxCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
  }

  /**
   * 全敵を描画
   */
  draw(ctx) {
    for (const enemy of this.enemies) {
      enemy.draw(ctx);
      
      if (this.game.debug) {
        enemy.drawDebug(ctx);
      }
    }
  }

  /**
   * 全敵をクリア
   */
  clear() {
    this.enemies = [];
  }

  /**
   * 指定範囲内の敵を取得
   */
  getEnemiesInRange(x, y, range) {
    return this.enemies.filter(enemy => {
      if (!enemy.isAlive || enemy.isDying) return false;
      
      const dx = enemy.x + enemy.width / 2 - x;
      const dy = enemy.y + enemy.height / 2 - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      return distance <= range;
    });
  }

  /**
   * 敵の数を取得
   */
  getCount() {
    return this.enemies.filter(e => e.isAlive && !e.isDying).length;
  }
}