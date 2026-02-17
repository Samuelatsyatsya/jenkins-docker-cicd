import { useState } from "react";
import { submitResult } from "../services/api.js";

// Possible choices
const choices = ["rock", "paper", "scissors"];

export default function Game({ username }) {
    // State variables
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState("");
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [draws, setDraws] = useState(0);

  const getComputerChoice = () => choices[Math.floor(Math.random() * choices.length)];

  const getResult = (player, computer) => {
    if (player === computer) return "draw";
    if (
      (player === "rock" && computer === "scissors") ||
      (player === "paper" && computer === "rock") ||
      (player === "scissors" && computer === "paper")
    ) return "win";
    return "lose";
  };

  // Play a round
  const play = async (choice) => {
    const computer = getComputerChoice();
    const gameResult = getResult(choice, computer);

    setPlayerChoice(choice);
    setComputerChoice(computer);
    setResult(gameResult);

    if (gameResult === "win") setPlayerScore((s) => s + 1);
    if (gameResult === "lose") setComputerScore((s) => s + 1);
    if (gameResult === "draw") setDraws((s) => s + 1);

    try {
      await submitResult(username, gameResult);
    } catch (err) {
      console.error("Error saving result:", err);
    }
  };

  const resetGame = () => {
    setPlayerScore(0);
    setComputerScore(0);
    setDraws(0);
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Rock Paper Scissors</h1>


      <div className="flex gap-8 mb-6">
        <div>
          <p className="text-gray-400">You</p>
          <p className="text-2xl font-bold">{playerScore}</p>
        </div>
        <div>
          <p className="text-gray-400">Draws</p>
          <p className="text-2xl font-bold">{draws}</p>
        </div>
        <div>
          <p className="text-gray-400">Computer</p>
          <p className="text-2xl font-bold">{computerScore}</p>
        </div>
      </div>

{/* Choice buttons */}
      <div className="flex gap-4 mb-6">
        {choices.map((choice) => (
          <button
            key={choice}
            onClick={() => play(choice)}
            className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 capitalize"
          >
            {choice}
          </button>
        ))}
      </div>

{/* Display results */}
      {playerChoice && (
        <div className="text-center space-y-2">
          <p>You chose: <span className="font-semibold">{playerChoice}</span></p>
          <p>Computer chose: <span className="font-semibold">{computerChoice}</span></p>
          <p className="text-xl mt-2 capitalize">
            {result === "win" && "You Win!"}
            {result === "lose" && "You Lose"}
            {result === "draw" && "It's a Draw"}
          </p>
        </div>
      )}

      <button
        onClick={resetGame}
        className="mt-6 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
      >
        Reset Scores
      </button>
    </div>
  );
}
