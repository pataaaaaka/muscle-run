// ==================== ステージデータ定義 ====================
const STAGE_DATA = {
  "1-1": {
    name: "Hamburger Alley",
    namej: "ハンバーガー横丁",
    bgm: "stage1",
    timeLimit: 180,
    clearCondition: { type: "reach_goal", x: 2400 },
    difficulty: "tutorial",
    
    blocks: [
      // 地面
      { type: "solid", x: 0, y: 550, width: 3000, height: 50 },
      
      // チュートリアル用の段差
      { type: "solid", x: 300, y: 500 },
      { type: "solid", x: 350, y: 450 },
      { type: "solid", x: 400, y: 400 },
      
      // ハテナブロック（コイン入り）
      { type: "question", x: 500, y: 350 },
      { type: "question", x: 700, y: 350 },
      
      // 壊せるブロック
      { type: "breakable", x: 900, y: 500 },
      { type: "breakable", x: 950, y: 500 },
      { type: "breakable", x: 1000, y: 500 },
      
      // 足場
      { type: "platform", x: 1200, y: 400, width: 150 },
      { type: "platform", x: 1400, y: 350, width: 150 },
      
      // ゴール手前の障害物
      { type: "solid", x: 2000, y: 450, width: 50, height: 100 },
      { type: "solid", x: 2100, y: 400, width: 50, height: 150 }
    ],
    
    enemies: [
      { type: "Hamburger", x: 600, y: 500, delay: 0 },
      { type: "FrenchFries", x: 800, y: 500, delay: 2000 },
      { type: "Hamburger", x: 1100, y: 500, delay: 4000 },
      { type: "Pizza", x: 1500, y: 500, delay: 6000 }
    ],
    
    items: [
      { type: "coin", x: 400, y: 300 },
      { type: "coin", x: 600, y: 400 },
      { type: "coin", x: 800, y: 400 },
      { type: "dumbbell", x: 1300, y: 300 },
      { type: "protein", x: 1600, y: 200 }
    ],
    
    goal: { x: 2400, y: 450, width: 50, height: 100 }
  },
  
  "1-2": {
    name: "Fried Avenue",
    namej: "フライドアベニュー",
    bgm: "stage1",
    timeLimit: 200,
    clearCondition: { type: "reach_goal", x: 3000 },
    difficulty: "normal",
    
    blocks: [
      { type: "solid", x: 0, y: 550, width: 3500, height: 50 },
      
      // 動く足場エリア
      { type: "moving_horizontal", x: 400, y: 400, width: 100, range: 200 },
      { type: "moving_horizontal", x: 800, y: 350, width: 100, range: 150 },
      
      // 氷ブロックエリア
      { type: "ice", x: 1200, y: 500 },
      { type: "ice", x: 1250, y: 500 },
      { type: "ice", x: 1300, y: 500 },
      { type: "ice", x: 1350, y: 500 },
      
      // トランポリンエリア
      { type: "trampoline", x: 1600, y: 530 },
      { type: "platform", x: 1650, y: 300, width: 100 },
      
      // 階段状の足場
      { type: "solid", x: 2000, y: 500, width: 100, height: 50 },
      { type: "solid", x: 2150, y: 450, width: 100, height: 100 },
      { type: "solid", x: 2300, y: 400, width: 100, height: 150 },
      
      // ハテナブロック
      { type: "question", x: 900, y: 300 },
      { type: "question", x: 1500, y: 350 },
      { type: "question", x: 2200, y: 350 }
    ],
    
    enemies: [
      { type: "FrenchFries", x: 500, y: 500, delay: 0 },
      { type: "FrenchFries", x: 900, y: 500, delay: 2000 },
      { type: "Donut", x: 1400, y: 500, delay: 4000 },
      { type: "Virus", x: 1800, y: 500, delay: 6000 },
      { type: "FrenchFries", x: 2200, y: 500, delay: 8000 }
    ],
    
    items: [
      { type: "coin", x: 450, y: 350 },
      { type: "coin", x: 850, y: 300 },
      { type: "gymgear", x: 1650, y: 250 },
      { type: "protein", x: 2200, y: 300 },
      { type: "dumbbell", x: 2500, y: 400 }
    ],
    
    goal: { x: 3000, y: 450, width: 50, height: 100 }
  },
  
  "1-3": {
    name: "Pizza Plaza",
    namej: "ピザプラザ",
    bgm: "stage2",
    timeLimit: 220,
    clearCondition: { type: "reach_goal", x: 3200 },
    difficulty: "normal",
    
    blocks: [
      { type: "solid", x: 0, y: 550, width: 3700, height: 50 },
      
      // 消える床エリア
      { type: "disappearing", x: 500, y: 450, width: 50 },
      { type: "disappearing", x: 600, y: 450, width: 50 },
      { type: "disappearing", x: 700, y: 450, width: 50 },
      
      // 壊せるブロックの壁
      { type: "breakable", x: 1000, y: 500 },
      { type: "breakable", x: 1000, y: 450 },
      { type: "breakable", x: 1000, y: 400 },
      { type: "breakable", x: 1050, y: 500 },
      { type: "breakable", x: 1050, y: 450 },
      
      // 縦に動く足場
      { type: "moving_vertical", x: 1300, y: 450, width: 100, range: 200 },
      { type: "moving_vertical", x: 1500, y: 350, width: 100, range: 200 },
      
      // 複雑な足場配置
      { type: "platform", x: 1800, y: 450, width: 100 },
      { type: "platform", x: 2000, y: 400, width: 80 },
      { type: "platform", x: 2200, y: 350, width: 100 },
      { type: "platform", x: 2400, y: 400, width: 80 },
      
      // ハテナブロック
      { type: "question", x: 1200, y: 350 },
      { type: "question", x: 1900, y: 350 },
      { type: "question", x: 2500, y: 300 }
    ],
    
    enemies: [
      { type: "Pizza", x: 600, y: 500, delay: 0 },
      { type: "Pizza", x: 1100, y: 500, delay: 2000 },
      { type: "Bacteria", x: 1400, y: 500, delay: 4000 },
      { type: "Pizza", x: 1900, y: 500, delay: 6000 },
      { type: "Virus", x: 2300, y: 500, delay: 8000 },
      { type: "Pizza", x: 2700, y: 500, delay: 10000 }
    ],
    
    items: [
      { type: "coin", x: 550, y: 400 },
      { type: "coin", x: 650, y: 400 },
      { type: "protein", x: 1300, y: 350 },
      { type: "dumbbell", x: 1800, y: 400 },
      { type: "gymgear", x: 2200, y: 300 },
      { type: "coin", x: 2500, y: 250 }
    ],
    
    goal: { x: 3200, y: 450, width: 50, height: 100 }
  },
  
  "1-4": {
    name: "Donut Park",
    namej: "ドーナツパーク",
    bgm: "stage2",
    timeLimit: 240,
    clearCondition: { type: "reach_goal", x: 3500 },
    difficulty: "hard",
    
    blocks: [
      { type: "solid", x: 0, y: 550, width: 4000, height: 50 },
      
      // 溶岩エリア
      { type: "lava", x: 600, y: 530, width: 200 },
      { type: "platform", x: 650, y: 450, width: 100 },
      
      // トランポリンコンボ
      { type: "trampoline", x: 1000, y: 530 },
      { type: "platform", x: 1050, y: 300, width: 80 },
      { type: "trampoline", x: 1200, y: 530 },
      { type: "platform", x: 1250, y: 250, width: 80 },
      
      // 氷の滑る床
      { type: "ice", x: 1500, y: 500 },
      { type: "ice", x: 1550, y: 500 },
      { type: "ice", x: 1600, y: 500 },
      { type: "ice", x: 1650, y: 500 },
      { type: "ice", x: 1700, y: 500 },
      
      // 複雑な動く足場
      { type: "moving_horizontal", x: 2000, y: 400, width: 100, range: 300 },
      { type: "moving_vertical", x: 2400, y: 450, width: 100, range: 200 },
      
      // 壊せるブロックの迷路
      { type: "breakable", x: 2700, y: 500 },
      { type: "breakable", x: 2750, y: 500 },
      { type: "breakable", x: 2700, y: 450 },
      { type: "solid", x: 2800, y: 500, width: 50, height: 50 },
      { type: "breakable", x: 2850, y: 500 },
      { type: "breakable", x: 2850, y: 450 },
      
      // ゴール前の最終チャレンジ
      { type: "disappearing", x: 3100, y: 450, width: 50 },
      { type: "disappearing", x: 3200, y: 450, width: 50 },
      { type: "trampoline", x: 3300, y: 530 },
      
      // ハテナブロック
      { type: "question", x: 900, y: 350 },
      { type: "question", x: 1400, y: 350 },
      { type: "question", x: 2100, y: 300 },
      { type: "question", x: 2900, y: 350 }
    ],
    
    enemies: [
      { type: "Donut", x: 700, y: 500, delay: 0 },
      { type: "Donut", x: 1100, y: 500, delay: 2000 },
      { type: "PoisonMushroom", x: 1600, y: 500, delay: 4000 },
      { type: "Donut", x: 2100, y: 500, delay: 6000 },
      { type: "Pathogen", x: 2500, y: 500, delay: 8000 },
      { type: "Donut", x: 2800, y: 500, delay: 10000 },
      { type: "Bacteria", x: 3200, y: 500, delay: 12000 }
    ],
    
    items: [
      { type: "coin", x: 650, y: 400 },
      { type: "protein", x: 1050, y: 250 },
      { type: "dumbbell", x: 1250, y: 200 },
      { type: "gymgear", x: 1900, y: 400 },
      { type: "protein", x: 2400, y: 350 },
      { type: "coin", x: 2900, y: 300 },
      { type: "dumbbell", x: 3300, y: 400 }
    ],
    
    goal: { x: 3500, y: 450, width: 50, height: 100 }
  },
  
  "1-5": {
    name: "Final Boss Battle",
    namej: "最終決戦",
    bgm: "boss",
    timeLimit: 300,
    clearCondition: { type: "defeat_boss" },
    difficulty: "boss",
    
    blocks: [
      // ボス戦用のシンプルなアリーナ
      { type: "solid", x: 0, y: 550, width: 1500, height: 50 },
      
      // 両端に壁
      { type: "solid", x: -50, y: 0, width: 50, height: 600 },
      { type: "solid", x: 1500, y: 0, width: 50, height: 600 },
      
      // 足場
      { type: "platform", x: 300, y: 400, width: 150 },
      { type: "platform", x: 700, y: 400, width: 150 },
      { type: "platform", x: 1050, y: 400, width: 150 },
      { type: "platform", x: 500, y: 300, width: 100 },
      { type: "platform", x: 900, y: 300, width: 100 },
      
      // ハテナブロック（回復用）
      { type: "question", x: 150, y: 350 },
      { type: "question", x: 1300, y: 350 }
    ],
    
    boss: {
      type: "SlothSlob", // 最終ボス
      x: 750,
      y: 400
    },
    
    enemies: [
      // ボス戦中に追加で出現する雑魚敵
    ],
    
    items: [
      { type: "protein", x: 500, y: 250 },
      { type: "dumbbell", x: 900, y: 250 }
    ]
  },
  
  "H-1": {
    name: "Muscle Paradise",
    namej: "筋肉の楽園",
    bgm: "hidden",
    timeLimit: 300,
    clearCondition: { type: "reach_goal", x: 4000 },
    difficulty: "hidden",
    
    blocks: [
      { type: "solid", x: 0, y: 550, width: 4500, height: 50 },
      
      // 超難易度の障害物コース
      // トランポリンコンボ
      { type: "trampoline", x: 300, y: 530 },
      { type: "platform", x: 350, y: 350, width: 80 },
      { type: "trampoline", x: 500, y: 530 },
      { type: "platform", x: 550, y: 250, width: 80 },
      { type: "trampoline", x: 700, y: 530 },
      { type: "platform", x: 750, y: 200, width: 80 },
      
      // 消える床の連続
      { type: "disappearing", x: 1000, y: 450, width: 50 },
      { type: "disappearing", x: 1100, y: 450, width: 50 },
      { type: "disappearing", x: 1200, y: 450, width: 50 },
      { type: "disappearing", x: 1300, y: 450, width: 50 },
      { type: "disappearing", x: 1400, y: 450, width: 50 },
      
      // 溶岩エリア
      { type: "lava", x: 1600, y: 530, width: 400 },
      { type: "moving_horizontal", x: 1700, y: 450, width: 80, range: 250 },
      
      // 氷と動く足場の複合
      { type: "ice", x: 2200, y: 500 },
      { type: "ice", x: 2250, y: 500 },
      { type: "moving_vertical", x: 2350, y: 400, width: 100, range: 200 },
      { type: "ice", x: 2550, y: 500 },
      { type: "ice", x: 2600, y: 500 },
      
      // 壊せるブロックの迷路
      { type: "breakable", x: 2800, y: 500 },
      { type: "breakable", x: 2850, y: 500 },
      { type: "breakable", x: 2800, y: 450 },
      { type: "breakable", x: 2900, y: 500 },
      { type: "breakable", x: 2900, y: 450 },
      { type: "breakable", x: 2900, y: 400 },
      
      // 最終チャレンジ
      { type: "moving_horizontal", x: 3200, y: 400, width: 100, range: 300 },
      { type: "moving_vertical", x: 3600, y: 450, width: 100, range: 250 },
      { type: "trampoline", x: 3900, y: 530 },
      
      // ハテナブロック（大量配置）
      { type: "question", x: 900, y: 350 },
      { type: "question", x: 1500, y: 300 },
      { type: "question", x: 2100, y: 350 },
      { type: "question", x: 2700, y: 300 },
      { type: "question", x: 3400, y: 300 }
    ],
    
    enemies: [
      // 全種類の敵が大量出現
      { type: "Hamburger", x: 400, y: 500, delay: 0 },
      { type: "FrenchFries", x: 800, y: 500, delay: 1000 },
      { type: "Pizza", x: 1200, y: 500, delay: 2000 },
      { type: "Donut", x: 1600, y: 500, delay: 3000 },
      { type: "Soda", x: 2000, y: 500, delay: 4000 },
      { type: "Virus", x: 2400, y: 500, delay: 5000 },
      { type: "Bacteria", x: 2800, y: 500, delay: 6000 },
      { type: "PoisonMushroom", x: 3200, y: 500, delay: 7000 },
      { type: "Pathogen", x: 3600, y: 500, delay: 8000 },
      { type: "DecayGerm", x: 3900, y: 500, delay: 9000 }
    ],
    
    items: [
      // 大量のアイテム
      { type: "protein", x: 750, y: 150 },
      { type: "dumbbell", x: 1250, y: 400 },
      { type: "gymgear", x: 2350, y: 300 },
      { type: "protein", x: 3200, y: 350 },
      { type: "dumbbell", x: 3600, y: 350 },
      { type: "coin", x: 500, y: 300 },
      { type: "coin", x: 1000, y: 400 },
      { type: "coin", x: 1500, y: 250 },
      { type: "coin", x: 2000, y: 400 },
      { type: "coin", x: 2500, y: 450 },
      { type: "coin", x: 3000, y: 400 },
      { type: "coin", x: 3500, y: 300 }
    ],
    
    goal: { x: 4000, y: 450, width: 50, height: 100 }
  }
};

// ステージデータ取得用のヘルパー関数
function getStageData(stageId) {
  return STAGE_DATA[stageId] || null;
}

function getAllStageIds() {
  return Object.keys(STAGE_DATA);
}