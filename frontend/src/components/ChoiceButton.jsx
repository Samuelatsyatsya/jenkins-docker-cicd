import { CHOICE_CONFIG } from '../utils/constants.js';

export const ChoiceButton = ({ choice, onClick, disabled, isSelected }) => {
  const config = CHOICE_CONFIG[choice];
  
  if (!config) return null;

  return (
    <button
      onClick={() => onClick(choice)}
      disabled={disabled}
      className={`
        relative flex flex-col items-center justify-center
        p-6 rounded-2xl transition-all duration-300
        ${config.color}
        ${isSelected ? 'ring-4 ring-white ring-opacity-50 scale-110' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
        border-2 shadow-2xl
      `}
    >
      <span className="text-5xl mb-2">{config.emoji}</span>
      <span className="text-lg font-bold uppercase tracking-wider">
        {config.label}
      </span>
      <div className="absolute -top-2 -right-2 bg-white text-gray-900 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
        vs
      </div>
    </button>
  );
};