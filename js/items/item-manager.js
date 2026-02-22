/**
 * ItemManager.js
 * アイテムの生成・管理システム
 */

class ItemManager {
  constructor(game) {
    this.game = game;
    this.items = [];
    
    // アイテムクラスのマッピング
    this.itemClasses = {
      'coin': Coin,
      'dumbbell': Dumbbell,
      'protein': Protein,
      'gymgear': GymGear,
      'key': Key
    };
  }

  /**
   * 更新処理
   */
  update() {
    // 全アイテムの更新
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.update();
      
      // 非アクティブなアイテムを削除
      if (!item.isActive) {
        this.items.splice(i, 1);
      }
    }
  }

  /**
   * アイテムを生成
   */
  spawnItem(itemType, x, y, fromBlock = false) {
    const ItemClass = this.itemClasses[itemType];
    
    if (!ItemClass) {
      console.error(`Unknown item type: ${itemType}`);
      return null;
    }
    
    const item = new ItemClass(this.game, x, y, fromBlock);
    this.items.push(item);
    
    return item;
  }

  /**
   * 複数アイテムを一度に生成（ボス撃破時など）
   */
  spawnMultipleItems(itemList, centerX, centerY) {
    const totalItems = itemList.reduce((sum, item) => sum + item.count, 0);
    let currentIndex = 0;
    
    itemList.forEach(itemData => {
      for (let i = 0; i < itemData.count; i++) {
        // 円形に配置
        const angle = (Math.PI * 2 * currentIndex) / totalItems;
        const distance = 40 + Math.random() * 30;
        
        const spawnX = centerX + Math.cos(angle) * distance;
        const spawnY = centerY + Math.sin(angle) * distance;
        
        // アイテム生成
        setTimeout(() => {
          this.spawnItem(itemData.type, spawnX, spawnY, true);
        }, currentIndex * 50); // 時間差で生成
        
        currentIndex++;
      }
    });
  }

  /**
   * ランダムなアイテムを生成
   */
  spawnRandomItem(x, y, fromBlock = false) {
    const itemTypes = ['coin', 'dumbbell', 'protein', 'gymgear'];
    const weights = [50, 25, 15, 10]; // コインが50%、鉄アレイが25%...
    
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < itemTypes.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return this.spawnItem(itemTypes[i], x, y, fromBlock);
      }
    }
    
    // フォールバック
    return this.spawnItem('coin', x, y, fromBlock);
  }

  /**
   * プレイヤーとの衝突チェック
   */
  checkPlayerCollisions(player) {
    for (const item of this.items) {
      if (item.checkPlayerCollision && item.checkPlayerCollision(player)) {
        item.collect(player);
      }
    }
  }

  /**
   * 複数アイテム生成（ボスドロップ用 - 互換性のため）
   */
  spawnItems(itemData) {
    itemData.forEach((data, index) => {
      const ItemClass = this.getItemClass(data.type);
      if (!ItemClass) return;
      
      for (let i = 0; i < data.count; i++) {
        const totalItems = itemData.reduce((sum, d) => sum + d.count, 0);
        const itemIndex = index * data.count + i;
        const angle = (Math.PI * 2 * itemIndex) / totalItems;
        const distance = 60 + Math.random() * 40;
        
        const spawnX = data.x + Math.cos(angle) * distance;
        const spawnY = data.y + Math.sin(angle) * distance;
        
        const item = new ItemClass(this.game, spawnX, spawnY);
        item.vx = Math.cos(angle) * 3;
        item.vy = Math.sin(angle) * 3 - 5;
        
        this.items.push(item);
      }
    });
  }

  /**
   * アイテムタイプからクラスを取得
   */
  getItemClass(itemType) {
    return this.itemClasses[itemType];
  }

  /**
   * 描画処理
   */
  draw(ctx) {
    for (const item of this.items) {
      item.draw(ctx);
    }
  }

  /**
   * 全アイテムをクリア
   */
  clear() {
    this.items = [];
  }

  /**
   * アイテム数を取得
   */
  getCount() {
    return this.items.length;
  }

  /**
   * 特定のアイテムタイプの数を取得
   */
  getCountByType(itemType) {
    return this.items.filter(item => 
      item.constructor.name.toLowerCase().includes(itemType.toLowerCase())
    ).length;
  }
}