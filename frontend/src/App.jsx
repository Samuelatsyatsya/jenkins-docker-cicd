import { useState, useEffect, useCallback } from 'react';
import { useGame, useGameLogic } from './hooks';
import { UsernameModal, ChoiceButton, Leaderboard } from './components';
import { CHOICE_CONFIG, GAME_CHOICES, GAME_RESULTS } from './utils/constants.js';
import { 
  ArrowPathIcon, 
  UserCircleIcon,
  ServerStackIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';
import { 
  TrophyIcon, 
  FireIcon,
  QuestionMarkCircleIcon 
} from '@heroicons/react/24/solid';

function App() {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [sessionStartTime, setSessionStartTime] = useState(null);

  const { 
    username, 
    playerStats, 
    isLoading, 
    backendStatus, 
    submitGame, 
    fetchPlayerStats,
    resetLocalStats 
  } = useGame();

  const { 
    getComputerChoice, 
    determineWinner, 
    getChoiceEmoji,
    getResultColor,
    getResultMessage 
  } = useGameLogic();

  // Initialize session timer
  useEffect(() => {
    if (username) {
      setSessionStartTime(Date.now());
    }
  }, [username]);

  // Fetch player stats when username changes
  useEffect(() => {
    if (username) {
      fetchPlayerStats();
    }
  }, [username, fetchPlayerStats]);

  const handleChoiceSelect = useCallback(async (choice) => {
    if (!username) {
      setShowUsernameModal(true);
      return;
    }

    const computer = getComputerChoice();
    const result = determineWinner(choice, computer);

    setPlayerChoice(choice);
    setComputerChoice(computer);
    setGameResult(result);

    // Calculate session duration
    const duration = sessionStartTime 
      ? Math.floor((Date.now() - sessionStartTime) / 1000)
      : null;

    // Submit to backend
    const gameData = await submitGame(choice, computer, result, duration);

    // Update local history
    if (gameData) {
      setGameHistory(prev => [{
        player: choice,
        computer,
        result,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev.slice(0, 9)]);
    }
  }, [username, getComputerChoice, determineWinner, submitGame, sessionStartTime]);

  const resetGame = useCallback(() => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setGameResult(null);
    setGameHistory([]);
    resetLocalStats();
  }, [resetLocalStats]);

  const getResultConfig = (result) => {
    const configs = {
      [GAME_RESULTS.WIN]: { bg: 'bg-green-900/20', text: 'text-green-400' },
      [GAME_RESULTS.LOSE]: { bg: 'bg-red-900/20', text: 'text-red-400' },
      [GAME_RESULTS.DRAW]: { bg: 'bg-yellow-900/20', text: 'text-yellow-400' }
    };
    return configs[result] || { bg: 'bg-gray-800', text: 'text-gray-400' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-600 rounded-lg">
                <TrophyIcon className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Rock Paper Scissors</h1>
                <p className="text-sm text-gray-400">Three-Tier Architecture Demo</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                backendStatus === 'connected' 
                  ? 'bg-green-900/30 text-green-400' 
                  : 'bg-red-900/30 text-red-400'
              }`}>
                <ServerStackIcon className="w-5 h-5" />
                <span className="text-sm font-medium">
                  Backend: {backendStatus === 'connected' ? 'Online' : 'Offline'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {username ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
                    <UserCircleIcon className="w-5 h-5" />
                    <span className="font-medium">{username}</span>
                    <button
                      onClick={() => setShowUsernameModal(true)}
                      className="text-sm text-gray-400 hover:text-white"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowUsernameModal(true)}
                    className="btn-primary"
                  >
                    Set Username
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Game Controls */}
          <div className="lg:col-span-2 space-y-8">
            {/* Game Arena */}
            <div className="card">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Game Arena</h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={resetGame}
                    className="btn-secondary"
                  >
                    <ArrowPathIcon className="w-5 h-5 mr-2" />
                    Reset Game
                  </button>
                </div>
              </div>

              {/* Choice Selection */}
              <div className="mb-12">
                <h3 className="text-xl font-bold mb-6 text-center">
                  Choose Your Weapon
                </h3>
                <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
                  {Object.values(GAME_CHOICES).map((choice) => (
                    <ChoiceButton
                      key={choice}
                      choice={choice}
                      onClick={handleChoiceSelect}
                      disabled={isLoading}
                      isSelected={playerChoice === choice}
                    />
                  ))}
                </div>
              </div>

              {/* Game Result Display */}
              {gameResult && (
                <div className={`
                  p-8 rounded-2xl border-2 text-center
                  ${getResultConfig(gameResult).bg}
                  ${getResultConfig(gameResult).text}
                  animate-pulse-slow
                `}>
                  <div className="text-6xl mb-4">
                    {getChoiceEmoji(playerChoice)} vs {getChoiceEmoji(computerChoice)}
                  </div>
                  <h3 className="text-4xl font-bold mb-2">
                    {getResultMessage(gameResult)}
                  </h3>
                  <p className="text-xl">
                    You chose <span className="font-bold">{playerChoice}</span> • 
                    Computer chose <span className="font-bold">{computerChoice}</span>
                  </p>
                </div>
              )}

              {/* Quick Stats */}
              {playerStats && (
                <div className="mt-8 grid grid-cols-4 gap-4">
                  <div className="bg-gray-900/50 p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-green-400">{playerStats.wins || 0}</div>
                    <div className="text-sm text-gray-400">Wins</div>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-red-400">{playerStats.losses || 0}</div>
                    <div className="text-sm text-gray-400">Losses</div>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-yellow-400">{playerStats.draws || 0}</div>
                    <div className="text-sm text-gray-400">Draws</div>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-blue-400">
                      {playerStats.win_rate || 0}%
                    </div>
                    <div className="text-sm text-gray-400">Win Rate</div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Games */}
            {gameHistory.length > 0 && (
              <div className="card">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FireIcon className="w-5 h-5" />
                  Recent Games
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {gameHistory.map((game, index) => (
                    <div
                      key={index}
                      className={`
                        p-3 rounded-lg text-center
                        ${getResultConfig(game.result).bg}
                        ${getResultConfig(game.result).text}
                      `}
                    >
                      <div className="text-2xl mb-1">
                        {getChoiceEmoji(game.player)} {getChoiceEmoji(game.computer)}
                      </div>
                      <div className="text-sm font-bold capitalize">
                        {game.result}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {game.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How to Play */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <QuestionMarkCircleIcon className="w-5 h-5" />
                How to Play
              </h3>
              <div className="grid grid-cols-3 gap-6">
                {Object.entries(CHOICE_CONFIG).map(([choice, config]) => (
                  <div key={choice} className="text-center">
                    <div className="text-4xl mb-2">{config.emoji}</div>
                    <h4 className="font-bold mb-1">{config.label}</h4>
                    <p className="text-sm text-gray-400">
                      Beats: <span className="capitalize">{config.beats}</span>
                      <br />
                      Beaten by: <span className="capitalize">{config.beatenBy}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Leaderboard */}
          <div>
            <Leaderboard />
          </div>
        </div>
      </main>

      {/* Username Modal */}
      <UsernameModal
        isOpen={showUsernameModal}
        onClose={() => setShowUsernameModal(false)}
        onSave={(name) => {
          setSessionStartTime(Date.now());
          setShowUsernameModal(false);
        }}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-xl">Processing your move...</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              Rock Paper Scissors • Three-Tier Architecture Demo
            </div>
            <div>
              {import.meta.env.VITE_APP_VERSION && `v${import.meta.env.VITE_APP_VERSION}`}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;