import express from 'express';
import { GameController } from '../controllers/game.controller.js';
import { validate } from '../middleware/validate.js';
import { submitGameValidation, usernameValidation } from '../validations/game.validations.js';

const router = express.Router();

// Submit game result
router.post(
  '/submit',
  validate(submitGameValidation),
  GameController.submitGameResult
);

// Get leaderboard
router.get(
  '/leaderboard',
  GameController.getLeaderboard
);

// Get player stats
router.get(
  '/player/:username',
  validate(usernameValidation, 'params'),
  GameController.getPlayerStats
);

// Get player game history
router.get(
  '/player/:username/history',
  validate(usernameValidation, 'params'),
  GameController.getGameHistory
);

export default router;