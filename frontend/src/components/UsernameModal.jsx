import { useState } from 'react';
import { useGame } from '../hooks/useGame.js';
import toast from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/outline';

export const UsernameModal = ({ isOpen, onClose, onSave }) => {
  const [input, setInput] = useState('');
  const { saveUsername } = useGame();

  const handleSubmit = (e) => {
    e.preventDefault();
    const saved = saveUsername(input);
    if (saved) {
      onSave(input);
      setInput('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="card max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold mb-2">Enter Your Username</h2>
        <p className="text-gray-400 mb-6">
          This name will be used on the leaderboard and to track your stats
        </p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter username (min 3 chars)"
            className="input-field mb-4"
            autoFocus
          />
          
          <div className="flex gap-3">
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={input.length < 3}
            >
              Save & Continue
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Username can contain letters, numbers, and underscores
          </p>
        </form>
      </div>
    </div>
  );
};