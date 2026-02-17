import { useEffect } from 'react';
import { useGame } from '../hooks/useGame.js';
import { TrophyIcon, FireIcon, ChartBarIcon } from '@heroicons/react/24/solid';

export const Leaderboard = () => {
  const { leaderboard, fetchLeaderboard, username } = useGame();

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  const getRankColor = (index) => {
    switch (index) {
      case 0: return 'bg-yellow-500/20 border-yellow-500';
      case 1: return 'bg-gray-400/20 border-gray-400';
      case 2: return 'bg-amber-700/20 border-amber-600';
      default: return 'bg-gray-800/50 border-gray-700';
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <TrophyIcon className="w-5 h-5 text-yellow-500" />;
      case 1: return <TrophyIcon className="w-5 h-5 text-gray-400" />;
      case 2: return <TrophyIcon className="w-5 h-5 text-amber-600" />;
      default: return <span className="text-sm font-bold">#{index + 1}</span>;
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrophyIcon className="w-8 h-8 text-yellow-500" />
          <h2 className="text-2xl font-bold">Leaderboard</h2>
        </div>
        <button
          onClick={fetchLeaderboard}
          className="btn-secondary text-sm px-4 py-2"
        >
          Refresh
        </button>
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center py-12">
          <ChartBarIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No games played yet</p>
          <p className="text-sm text-gray-500 mt-2">Be the first to appear on the leaderboard!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((player, index) => (
            <div
              key={player.id}
              className={`
                flex items-center justify-between p-4 rounded-xl border
                ${getRankColor(index)}
                ${player.username === username ? 'ring-2 ring-primary-500' : ''}
                transition-all duration-200 hover:scale-[1.02]
              `}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900">
                  {getRankIcon(index)}
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">
                      {player.username}
                    </span>
                    {player.username === username && (
                      <span className="px-2 py-1 text-xs bg-primary-500 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{player.total_games} games</span>
                    {index < 3 && (
                      <span className="flex items-center gap-1">
                        <FireIcon className="w-4 h-4" />
                        Top {index + 1}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{player.wins}</div>
                    <div className="text-xs text-gray-400">Wins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{player.losses}</div>
                    <div className="text-xs text-gray-400">Losses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{player.win_rate}%</div>
                    <div className="text-xs text-gray-400">Win Rate</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-700">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <ChartBarIcon className="w-5 h-5" />
          Statistics
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-900/50 p-3 rounded-lg">
            <div className="text-2xl font-bold">{leaderboard.length}</div>
            <div className="text-sm text-gray-400">Total Players</div>
          </div>
          <div className="bg-gray-900/50 p-3 rounded-lg">
            <div className="text-2xl font-bold">
              {leaderboard.reduce((sum, player) => sum + (player.total_games || 0), 0)}
            </div>
            <div className="text-sm text-gray-400">Total Games</div>
          </div>
          <div className="bg-gray-900/50 p-3 rounded-lg">
            <div className="text-2xl font-bold">
              {leaderboard.length > 0 
                ? (leaderboard.reduce((sum, player) => sum + (player.win_rate || 0), 0) / leaderboard.length).toFixed(1)
                : 0}%
            </div>
            <div className="text-sm text-gray-400">Avg Win Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};