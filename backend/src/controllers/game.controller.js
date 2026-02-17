import { GameService } from '../services/game.service.js';
import { GAME_CHOICES, GAME_RESULTS, HTTP_STATUS } from '../config/constants.js';

export class GameController {
  static async submitGameResult(req, res, next) {
    try {
      const gameData = req.body;
      
      const result = await GameService.submitGameResult(gameData);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: result.is_new_user 
          ? 'New player created and game recorded' 
          : 'Game result recorded',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async getLeaderboard(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      
      const leaderboard = await GameService.getLeaderboard(limit);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: leaderboard
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPlayerStats(req, res, next) {
    try {
      const { username } = req.params;
      
      const stats = await GameService.getPlayerStats(username);
      
      if (!stats) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Player not found'
        });
      }
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  static async getGameHistory(req, res, next) {
    try {
      const { username } = req.params;
      const limit = parseInt(req.query.limit) || 20;
      const page = parseInt(req.query.page) || 1;
      const offset = (page - 1) * limit;
      
      const user = await User.findOne({
        where: { username }
      });
      
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Player not found'
        });
      }
      
      const { count, rows } = await GameSession.findAndCountAll({
        where: { user_id: user.id },
        limit,
        offset,
        order: [['created_at', 'DESC']]
      });
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: {
          games: rows,
          pagination: {
            total: count,
            page,
            limit,
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
}