import { User, GameSession } from '../models/index.js';
import { GAME_RESULTS } from '../config/constants.js';
import { sequelize } from '../config/db.js';

export class GameService {
  static async submitGameResult(gameData) {
    const { username, result, player_choice, computer_choice, session_duration } = gameData;

    // Find or create user
    const [user, created] = await User.findOrCreate({
      where: { username },
      defaults: { username, wins: 0, losses: 0, draws: 0 }
    });

    // Update user stats
    switch (result) {
      case GAME_RESULTS.WIN:
        await user.increment('wins');
        break;
      case GAME_RESULTS.LOSE:
        await user.increment('losses');
        break;
      case GAME_RESULTS.DRAW:
        await user.increment('draws');
        break;
    }

    // Create game session record
    const gameSession = await GameSession.create({
      user_id: user.id,
      player_choice,
      computer_choice,
      result,
      session_duration
    });

    // Reload user to get updated stats
    await user.reload();

    return {
      user: {
        id: user.id,
        username: user.username,
        wins: user.wins,
        losses: user.losses,
        draws: user.draws,
        total_games: user.total_games,
        win_rate: user.win_rate,
        last_active: user.last_active
      },
      game_session: gameSession,
      is_new_user: created
    };
  }

  static async getLeaderboard(limit = 10) {
    const users = await User.findAll({
      attributes: [
        'id',
        'username',
        'wins',
        'losses',
        'draws',
        'last_active',
        [
          sequelize.literal('wins + losses + draws'),
          'total_games'
        ],
        [
          sequelize.literal('ROUND((wins / NULLIF(wins + losses + draws, 0)) * 100, 1)'),
          'win_rate'
        ]
      ],
      order: [
        ['wins', 'DESC'],
        ['losses', 'ASC'],
        ['draws', 'ASC']
      ],
      limit
    });

    return users;
  }

  static async getPlayerStats(username) {
    const user = await User.findOne({
      where: { username },
      attributes: [
        'id',
        'username',
        'wins',
        'losses',
        'draws',
        'last_active',
        'created_at',
        'updated_at'
      ],
      include: [{
        model: GameSession,
        as: 'game_sessions',
        limit: 10,
        order: [['created_at', 'DESC']]
      }]
    });

    if (!user) {
      return null;
    }

    // Get recent game history
    const recentGames = await GameSession.findAll({
      where: { user_id: user.id },
      limit: 10,
      order: [['created_at', 'DESC']],
      attributes: ['player_choice', 'computer_choice', 'result', 'created_at']
    });

    // Calculate streaks
    const streaks = await this.calculateStreaks(user.id);

    return {
      ...user.toJSON(),
      total_games: user.total_games,
      win_rate: user.win_rate,
      recent_games: recentGames,
      streaks
    };
  }

  static async calculateStreaks(userId) {
    const sessions = await GameSession.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      attributes: ['result']
    });

    let currentStreak = 0;
    let longestWinStreak = 0;
    let currentWinStreak = 0;

    for (const session of sessions) {
      if (session.result === GAME_RESULTS.WIN) {
        currentWinStreak++;
        currentStreak++;
        longestWinStreak = Math.max(longestWinStreak, currentWinStreak);
      } else {
        currentWinStreak = 0;
        if (session.result === GAME_RESULTS.LOSE) {
          currentStreak = 0;
        }
      }
    }

    return {
      current_streak: currentStreak,
      longest_win_streak: longestWinStreak
    };
  }
}