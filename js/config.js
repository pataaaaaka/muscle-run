// ========== ゲーム設定 ==========
const GAME_CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  GROUND_Y: 550,
  
  // 画像パス設定（後から差し替え可能）
  IMAGES: {
    PLAYER: {
      SLIM: 'public/images/sprites/player-slim.png',
      NORMAL: 'public/images/sprites/player-normal.png',
      MUSCLE: 'public/images/sprites/player-muscle.png',
      FAT: 'public/images/sprites/player-fat.png'
    },
    ENEMIES: {
      HAMBURGER: 'public/images/sprites/enemy-hamburger.png',
      FRIES: 'public/images/sprites/enemy-fries.png',
      PIZZA: 'public/images/sprites/enemy-pizza.png',
      DONUT: 'public/images/sprites/enemy-donut.png',
      SODA: 'public/images/sprites/enemy-soda.png',
      VIRUS: 'public/images/sprites/enemy-virus.png',
      BACTERIA: 'public/images/sprites/enemy-bacteria.png',
      MUSHROOM: 'public/images/sprites/enemy-mushroom.png',
      PATHOGEN: 'public/images/sprites/enemy-pathogen.png',
      GERM: 'public/images/sprites/enemy-germ.png'
    },
    ITEMS: {
      COIN: 'public/images/sprites/item-coin.png',
      DUMBBELL: 'public/images/sprites/item-dumbbell.png',
      PROTEIN: 'public/images/sprites/item-protein.png',
      GYMGEAR: 'public/images/sprites/item-gymgear.png',
      KEY: 'public/images/sprites/item-key.png'
    },
    BLOCKS: {
      SOLID: 'public/images/sprites/block-solid.png',
      BREAKABLE: 'public/images/sprites/block-breakable.png',
      QUESTION: 'public/images/sprites/block-question.png',
      ICE: 'public/images/sprites/block-ice.png'
    },
    BACKGROUNDS: {
      TITLE: 'public/images/backgrounds/title-bg.png',
      STAGE1: 'public/images/backgrounds/stage1-bg.png',
      STAGE2: 'public/images/backgrounds/stage2-bg.png'
    },
    UI: {
      HEART_FULL: 'public/images/ui/heart-full.png',
      HEART_EMPTY: 'public/images/ui/heart-empty.png',
      GAUGE_BAR: 'public/images/ui/gauge-bar.png'
    }
  },
  
  // 画像を使用しない場合はemoji表示
  USE_EMOJIS: true
};

// グローバル変数
const W = GAME_CONFIG.CANVAS_WIDTH;
const H = GAME_CONFIG.CANVAS_HEIGHT;
const GROUND = GAME_CONFIG.GROUND_Y;
