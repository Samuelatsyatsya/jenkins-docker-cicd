export const GAME_CHOICES = {
  ROCK: 'rock',
  PAPER: 'paper',
  SCISSORS: 'scissors'
};

export const GAME_RESULTS = {
  WIN: 'win',
  LOSE: 'lose',
  DRAW: 'draw'
};

export const CHOICE_CONFIG = {
  [GAME_CHOICES.ROCK]: {
    label: 'Rock',
    emoji: '🪨',
    color: 'bg-red-600 hover:bg-red-700 border-red-500',
    beats: GAME_CHOICES.SCISSORS,
    beatenBy: GAME_CHOICES.PAPER
  },
  [GAME_CHOICES.PAPER]: {
    label: 'Paper',
    emoji: '📄',
    color: 'bg-blue-600 hover:bg-blue-700 border-blue-500',
    beats: GAME_CHOICES.ROCK,
    beatenBy: GAME_CHOICES.SCISSORS
  },
  [GAME_CHOICES.SCISSORS]: {
    label: 'Scissors',
    emoji: '✂️',
    color: 'bg-green-600 hover:bg-green-700 border-green-500',
    beats: GAME_CHOICES.PAPER,
    beatenBy: GAME_CHOICES.ROCK
  }
};

export const RESULT_CONFIG = {
  [GAME_RESULTS.WIN]: {
    label: 'Win',
    emoji: '🎉',
    color: 'text-green-400 bg-green-900/30 border-green-500',
    message: 'You Win!'
  },
  [GAME_RESULTS.LOSE]: {
    label: 'Lose',
    emoji: '💔',
    color: 'text-red-400 bg-red-900/30 border-red-500',
    message: 'You Lose'
  },
  [GAME_RESULTS.DRAW]: {
    label: 'Draw',
    emoji: '🤝',
    color: 'text-yellow-400 bg-yellow-900/30 border-yellow-500',
    message: "It's a Draw"
  }
};