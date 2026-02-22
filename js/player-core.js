// ========== プレイヤーコアシステム ==========
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 40;
const PLAYER_SPEED = 4;
const JUMP_POWER = -12;
const GRAVITY = 0.5;
const DASH_SPEED = 8;
const DASH_DURATION = 15;

const BODY_TYPES = {
  SLIM: {
    name: 'SLIM',
    condition: (fat, muscle) => fat + muscle < 30,
    speedMultiplier: 1.3,
    jumpMultiplier: 1.3,
    dashMultiplier: 1.2,
    color: '#87CEEB',
    canThrow: false,
    width: 0.8,
    height: 1.1
  },
  NORMAL: {
    name: 'NORMAL',
    condition: (fat, muscle) => fat + muscle >= 30 && Math.abs(fat - muscle) <= 20,
    speedMultiplier: 1.0,
    jumpMultiplier: 1.0,
    dashMultiplier: 1.0,
    color: '#FFD700',
    canThrow: false,
    width: 1.0,
    height: 1.0
  },
  MUSCLE: {
    name: 'MUSCLE',
    condition: (fat, muscle) => muscle > fat && fat + muscle >= 30,
    speedMultiplier: 0.9,
    jumpMultiplier: 0.9,
    dashMultiplier: 0.8,
    color: '#FF4444',
    canThrow: true,
    width: 1.2,
    height: 1.1
  },
  FAT: {
    name: 'FAT',
    condition: (fat, muscle) => fat > muscle && fat + muscle >= 30,
    speedMultiplier: 0.7,
    jumpMultiplier: 0.6,
    dashMultiplier: 0.5,
    color: '#FFA500',
    canThrow: false,
    width: 1.3,
    height: 1.2
  }
};

function determineBodyType(fatGauge, muscleGauge) {
  if (BODY_TYPES.MUSCLE.condition(fatGauge, muscleGauge)) return 'MUSCLE';
  if (BODY_TYPES.FAT.condition(fatGauge, muscleGauge)) return 'FAT';
  if (BODY_TYPES.SLIM.condition(fatGauge, muscleGauge)) return 'SLIM';
  return 'NORMAL';
}

function getBodyTypeData(bodyType) {
  return BODY_TYPES[bodyType] || BODY_TYPES.NORMAL;
}
