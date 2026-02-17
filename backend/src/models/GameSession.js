import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { GAME_CHOICES, GAME_RESULTS } from '../config/constants.js';

const GameSession = sequelize.define('game_session', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  player_choice: {
    type: DataTypes.ENUM(...Object.values(GAME_CHOICES)),
    allowNull: false
  },
  computer_choice: {
    type: DataTypes.ENUM(...Object.values(GAME_CHOICES)),
    allowNull: false
  },
  result: {
    type: DataTypes.ENUM(...Object.values(GAME_RESULTS)),
    allowNull: false
  },
  session_duration: {
    type: DataTypes.INTEGER, // Duration in seconds
    allowNull: true
  }
}, {
  tableName: 'game_sessions',
  timestamps: true
});

export default GameSession;