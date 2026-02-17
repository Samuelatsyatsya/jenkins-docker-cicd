import { useState, useCallback, useEffect } from 'react';
import { gameApi } from '../services/api.js';
import toast from 'react-hot-toast';

export const useGame = () => {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('rps_username') || '';
  });
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerStats, setPlayerStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      await gameApi.healthCheck();
      setBackendStatus('connected');
    } catch (error) {
      setBackendStatus('disconnected');
      toast.error('Backend server is not responding');
    }
  };

  const saveUsername = useCallback((name) => {
    const cleanName = name.trim();
    if (cleanName.length >= 3) {
      setUsername(cleanName);
      localStorage.setItem('rps_username', cleanName);
      toast.success(`Welcome, ${cleanName}!`);
      return true;
    }
    toast.error('Username must be at least 3 characters');
    return false;
  }, []);

  const submitGame = useCallback(async (playerChoice, computerChoice, result, sessionDuration = null) => {
    if (!username) {
      toast.error('Please set a username first');
      return null;
    }

    setIsLoading(true);
    try {
      const gameData = {
        username,
        result,
        player_choice: playerChoice,
        computer_choice: computerChoice,
        session_duration: sessionDuration
      };

      const response = await gameApi.submitGame(gameData);
      toast.success(response.message);
      
      // Refresh stats
      await fetchPlayerStats();
      await fetchLeaderboard();
      
      return response.data;
    } catch (error) {
      console.error('Failed to submit game:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const response = await gameApi.getLeaderboard();
      if (response.success) {
        setLeaderboard(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    }
  }, []);

  const fetchPlayerStats = useCallback(async () => {
    if (!username) return;
    
    try {
      const response = await gameApi.getPlayerStats(username);
      if (response.success) {
        setPlayerStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch player stats:', error);
    }
  }, [username]);

  const resetLocalStats = useCallback(() => {
    setPlayerStats(null);
    toast.success('Local stats cleared');
  }, []);

  return {
    username,
    leaderboard,
    playerStats,
    isLoading,
    backendStatus,
    saveUsername,
    submitGame,
    fetchLeaderboard,
    fetchPlayerStats,
    resetLocalStats,
    checkBackendHealth
  };
};