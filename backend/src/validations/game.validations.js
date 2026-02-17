import Joi from 'joi';
import { GAME_CHOICES, GAME_RESULTS } from '../config/constants.js';

export const submitGameValidation = Joi.object({
  username: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Username can only contain letters, numbers, and underscores',
      'any.required': 'Username is required'
    }),
  result: Joi.string()
    .valid(...Object.values(GAME_RESULTS))
    .required()
    .messages({
      'any.only': `Result must be one of: ${Object.values(GAME_RESULTS).join(', ')}`,
      'any.required': 'Game result is required'
    }),
  player_choice: Joi.string()
    .valid(...Object.values(GAME_CHOICES))
    .required(),
  computer_choice: Joi.string()
    .valid(...Object.values(GAME_CHOICES))
    .required(),
  session_duration: Joi.number()
    .min(0)
    .max(300) // Max 5 minutes
});

export const usernameValidation = Joi.object({
  username: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
});