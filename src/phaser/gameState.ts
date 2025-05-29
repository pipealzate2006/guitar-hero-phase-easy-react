export const noteSpeed = 100;
export const noteScale = 0.1;
export const lanePositionsX = [355, 420, 490, 560];

export const gameState = {
  score: 0,
  scoreText: null as Phaser.GameObjects.Text | null,
  hasScored: false,

  timesEscIsPressed: 0,
  isModalGameOverOpen: false,

  currentNoteSpeed: noteSpeed,

  lastSpeedUpdateScore: 0,

  delayTimeCreateNote: 1500,
  highScore: 0,
};
