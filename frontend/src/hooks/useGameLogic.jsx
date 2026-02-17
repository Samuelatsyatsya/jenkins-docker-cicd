import { useCallback } from 'react';
import { GAME_CHOICES, GAME_RESULTS } from '../utils/constants.js';

export const useGameLogic = () => {
  const getComputerChoice = useCallback(() => {
    const choices = Object.values(GAME_CHOICES);
    return choices[Math.floor(Math.random() * choices.length)];
  }, []);

  const determineWinner = useCallback((playerChoice, computerChoice) => {
    if (playerChoice === computerChoice) {
      return GAME_RESULTS.DRAW;
    }

    const winConditions = {
      [GAME_CHOICES.ROCK]: GAME_CHOICES.SCISSORS,
      [GAME_CHOICES.PAPER]: GAME_CHOICES.ROCK,
      [GAME_CHOICES.SCISSORS]: GAME_CHOICES.PAPER
    };

    return winConditions[playerChoice] === computerChoice 
      ? GAME_RESULTS.WIN 
      : GAME_RESULTS.LOSE;
  }, []);

  const getChoiceEmoji = useCallback((choice) => {
    const emojis = {
      [GAME_CHOICES.ROCK]: '🪨',
      [GAME_CHOICES.PAPER]: '📄',
      [GAME_CHOICES.SCISSORS]: '✂️'
    };
    return emojis[choice] || '❓';
  }, []);

  const getResultColor = useCallback((result) => {
    const colors = {
      [GAME_RESULTS.WIN]: 'text-green-400',
      [GAME_RESULTS.LOSE]: 'text-red-400',
      [GAME_RESULTS.DRAW]: 'text-yellow-400'
    };
    return colors[result] || 'text-gray-400';
  }, []);

  const getResultMessage = useCallback((result) => {
    const messages = {
      [GAME_RESULTS.WIN]: 'You Win! 🎉',
      [GAME_RESULTS.LOSE]: 'You Lose 💔',
      [GAME_RESULTS.DRAW]: "It's a Draw! 🤝"
    };
    return messages[result] || 'Game Over';
  }, []);

  return {
    getComputerChoice,
    determineWinner,
    getChoiceEmoji,
    getResultColor,
    getResultMessage
  };
};