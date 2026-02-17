import User from './userModel.js';
import GameSession from './GameSession.js';

// Define associations
User.hasMany(GameSession, {
  foreignKey: 'user_id',
  as: 'game_sessions',
  onDelete: 'CASCADE'
});

GameSession.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

export { User, GameSession };