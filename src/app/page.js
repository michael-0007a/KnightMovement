"use client";
import { useState, useCallback, useEffect } from 'react';
import { Github, Instagram, Linkedin, Heart } from 'lucide-react';


const KnightTour = () => {
  const [board, setBoard] = useState(Array(8).fill().map(() => Array(8).fill(0)));
  const [currentPosition, setCurrentPosition] = useState(null);
  const [moveCount, setMoveCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [validMoves, setValidMoves] = useState([]);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);

  const knightMoves = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ];

  const validInitialPositions = [
    [7, 1], // b1
    [0, 1], // b8
    [7, 6], // g1
    [0, 6]  // g8
  ];

  useEffect(() => {
    if (showCompletionPopup) {
      window.scrollTo({
        top: 0,  // This will scroll to top of page
        behavior: 'smooth'
      });
    }
}, [showCompletionPopup]);

  const isValidMove = (row, col, board) => {
    return row >= 0 && row < 8 && col >= 0 && col < 8 && board[row][col] === 0;
  };

  const getValidMoves = useCallback((row, col, board) => {
    return knightMoves
      .map(([dr, dc]) => [row + dr, col + dc])
      .filter(([r, c]) => isValidMove(r, c, board));
  }, []);

  const isValidInitialPosition = (row, col) => {
    return validInitialPositions.some(([r, c]) => r === row && c === col);
  };

  const getPerformanceMessage = (count) => {
    if (count === 64) return { title: "Perfect Knight's Tour!", message: "Legendary performance! You've achieved the ultimate chess puzzle!", emoji: "👑" };
    if (count >= 50) return { title: "Outstanding Performance!", message: "Incredible skill! You're a true knight master!", emoji: "🏆" };
    if (count >= 35) return { title: "Excellent Run!", message: "Great strategy and planning!", emoji: "⭐" };
    if (count >= 20) return { title: "Good Effort!", message: "Nice work! Try different strategies to improve.", emoji: "🎯" };
    return { title: "Keep Practicing!", message: "Every master was once a beginner. Try again!", emoji: "🛡️" };
  };

  const handleSquareClick = (row, col) => {
    if (gameOver) return;

    if (currentPosition === null) {
      if (!isValidInitialPosition(row, col)) return;
      
      const newBoard = board.map(row => [...row]);
      newBoard[row][col] = 1;
      setBoard(newBoard);
      setCurrentPosition([row, col]);
      setMoveCount(1);
      setValidMoves(getValidMoves(row, col, newBoard));
    } else {
      const isValid = validMoves.some(([r, c]) => r === row && c === col);
      if (!isValid) return;

      const newBoard = board.map(row => [...row]);
      const newMoveCount = moveCount + 1;
      newBoard[row][col] = newMoveCount;
      setBoard(newBoard);
      setCurrentPosition([row, col]);
      setMoveCount(newMoveCount);

      const nextValidMoves = getValidMoves(row, col, newBoard);
      setValidMoves(nextValidMoves);

      if (nextValidMoves.length === 0) {
        setGameOver(true);
        setTimeout(() => setShowCompletionPopup(true), 800);
      }
    }
  };

  const resetGame = () => {
    setBoard(Array(8).fill().map(() => Array(8).fill(0)));
    setCurrentPosition(null);
    setMoveCount(0);
    setGameOver(false);
    setValidMoves([]);
    setShowCompletionPopup(false);
  };

  const getSquareClass = (row, col) => {
    const isLightSquare = (row + col) % 2 === 0;
    return `aspect-square flex items-center justify-center cursor-pointer relative ${
      isLightSquare ? "bg-[#FFD6A5]" : "bg-black"
    }`;
  };

  const getSquareName = (row, col) => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    return files[col] + ranks[row];
  };

  const performanceData = getPerformanceMessage(moveCount);

  return (
    <>
      <div className="flex flex-col items-center space-y-8">
        {/* Instructions - Starting positions */}
        {!currentPosition && (
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-[#FFF1E6]/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] max-w-lg text-center">
            <h3 className="text-xl font-bold text-[#CFFAFE] mb-3 drop-shadow-[0_0_10px_rgba(207,250,254,0.3)]">
              Choose Your Starting Position
            </h3>
            <p className="text-[#FFF1E6]/90 text-sm">
              Click one of the 4 highlighted squares to place your knight and begin the tour
            </p>
          </div>
        )}

        {/* Game Stats */}
        <div className="flex flex-row items-center justify-center gap-4 xs:gap-6 md:gap-8">
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-4 xs:p-5 md:p-6 border border-[#FFD6A5]/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] min-w-[120px] md:min-w-[160px] relative group hover:shadow-[0_8px_32px_rgba(255,214,165,0.3)] transition-all duration-300">
            <div className="absolute inset-0 bg-[#FFD6A5]/10 rounded-2xl blur-xl group-hover:bg-[#FFD6A5]/20 transition-all duration-300"></div>
            <div className="text-center relative">
              <div className="text-2xl xs:text-3xl md:text-4xl font-bold text-[#FFD6A5] drop-shadow-[0_0_12px_rgba(255,214,165,0.5)]">{moveCount}</div>
              <div className="text-xs xs:text-sm md:text-base text-[#FFF1E6]/80">Squares Visited</div>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-4 xs:p-5 md:p-6 border border-[#CFFAFE]/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] min-w-[120px] md:min-w-[160px] relative group hover:shadow-[0_8px_32px_rgba(207,250,254,0.3)] transition-all duration-300">
            <div className="absolute inset-0 bg-[#CFFAFE]/10 rounded-2xl blur-xl group-hover:bg-[#CFFAFE]/20 transition-all duration-300"></div>
            <div className="text-center relative">
              <div className="text-2xl xs:text-3xl md:text-4xl font-bold text-[#CFFAFE] drop-shadow-[0_0_12px_rgba(207,250,254,0.5)]">{validMoves.length}</div>
              <div className="text-xs xs:text-sm md:text-base text-[#FFF1E6]/80">Available Moves</div>
            </div>
          </div>
        </div>

        {/* Chessboard */}
        <div className="relative w-full max-w-[600px] xs:max-w-[500px] sm:max-w-[600px] md:max-w-[650px] lg:max-w-[700px] xl:max-w-[750px] mx-auto">
          <div className="absolute -inset-4 xs:-inset-6 sm:-inset-8 md:-inset-10 lg:-inset-12 bg-gradient-to-r from-[#FFD6A5]/10 via-[#FFF1E6]/5 to-[#FFD6A5]/10 rounded-2xl xs:rounded-3xl blur-xl"></div>
          <div className="relative bg-black/60 backdrop-blur-2xl rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 border border-[#FFD6A5]/20 shadow-[0_20px_60px_rgba(0,0,0,0.4)] group">
            <div className="absolute inset-0 bg-[#FFD6A5]/5 rounded-xl blur-2xl group-hover:bg-[#FFD6A5]/10 transition-all duration-300"></div>
            <div className="p-2 sm:p-3 md:p-4 lg:p-6 bg-[#FFF1E6] rounded-xl shadow-2xl relative">
              <div className="grid grid-cols-8 gap-0 rounded-lg overflow-hidden shadow-inner w-full aspect-square min-h-[300px] xs:min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[550px]">
                {board.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={getSquareClass(rowIndex, colIndex)}
                      onClick={() => handleSquareClick(rowIndex, colIndex)}
                    >
                      {currentPosition && currentPosition[0] === rowIndex && currentPosition[1] === colIndex && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-none">♞</div>
                        </div>
                      )}

                      {!currentPosition && isValidInitialPosition(rowIndex, colIndex) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-[#CFFAFE] opacity-70 rounded-full animate-pulse shadow-[0_0_15px_rgba(207,250,254,0.8)]"></div>
                        </div>
                      )}

                      {currentPosition && validMoves.some(([r, c]) => r === rowIndex && c === colIndex) &&
                        !(currentPosition && currentPosition[0] === rowIndex && currentPosition[1] === colIndex) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 bg-gray-500 opacity-60 rounded-full"></div>
                        </div>
                      )}

                      {board[rowIndex][colIndex] > 0 &&
                        !(currentPosition && currentPosition[0] === rowIndex && currentPosition[1] === colIndex) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          {(rowIndex + colIndex) % 2 === 0 ? (
                            <>
                              <div className="w-1/2 h-1 xs:h-1.5 sm:h-2 bg-black transform rotate-45 absolute"></div>
                              <div className="w-1/2 h-1 xs:h-1.5 sm:h-2 bg-black transform -rotate-45 absolute"></div>
                            </>
                          ) : (
                            <>
                              <div className="w-1/2 h-1 xs:h-1.5 sm:h-2 bg-[#FFD6A5] transform rotate-45 absolute"></div>
                              <div className="w-1/2 h-1 xs:h-1.5 sm:h-2 bg-[#FFD6A5] transform -rotate-45 absolute"></div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetGame}
          className="group relative bg-black/30 backdrop-blur-xl text-[#FFD6A5] px-8 py-3 rounded-2xl border border-[#FFD6A5]/30 shadow-[0_8px_32px_rgba(255,214,165,0.2)] hover:shadow-[0_12px_40px_rgba(255,214,165,0.3)] transition-all duration-300 font-medium"
        >
          <div className="absolute inset-0 bg-[#FFD6A5]/0 group-hover:bg-[#FFD6A5]/5 rounded-2xl transition-all duration-300"></div>
          <span className="relative">New Game</span>
        </button>
      </div>

      {/* Updated Game Completion Popup */}
      {showCompletionPopup && (
  <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">  {/* Changed this line */}
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md"></div>
    
    <div className="relative bg-[#1E1E1E] rounded-2xl p-8 max-w-sm w-full mx-4 text-center mt-8"> {/* Added mt-8 */}
      {/* Rest of the popup content stays the same */}
            {/* Emoji/Icon */}
            <div className="mb-6">
              <div className="inline-block text-5xl">{performanceData.emoji}</div>
            </div>
            
            {/* Title */}
            <h2 className="text-3xl font-bold text-[#FFD6A5] mb-6">
              {performanceData.title}
            </h2>
            
            {/* Score Box */}  
            <div className="bg-black/40 rounded-xl p-6 mb-6">
              <div className="text-5xl font-bold text-[#CFFAFE] mb-2">
                {moveCount}
              </div>
              <div className="text-[#FFF1E6]/80">
                squares visited out of 64
              </div>
            </div>

            {/* Message */}
            <p className="text-[#FFF1E6]/90 mb-8">
              {performanceData.message}
            </p>
            
            {/* Play Again Button */}
            <button
              onClick={resetGame}
              className="w-full bg-[#FFD6A5]/10 hover:bg-[#FFD6A5]/20 text-[#FFD6A5] px-6 py-3 rounded-xl border border-[#FFD6A5]/30 transition-all duration-300"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#000000] text-[#FBFBFB] p-2 xs:p-4 md:p-8 flex justify-center items-start relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFD6A5]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFF1E6]/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-[#FFD6A5]/3 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-6xl w-full backdrop-blur-2xl bg-black/20 rounded-2xl xs:rounded-3xl p-4 xs:p-6 sm:p-8 shadow-[0_20px_60px_rgba(255,214,165,0.08)] border border-[#FFD6A5]/15 flex flex-col items-center hover:shadow-[0_20px_60px_rgba(255,214,165,0.12)] transition-all duration-300">
        {/* Main Title */}
        <div className="text-center mb-8 xs:mb-10 sm:mb-12">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#FFD6A5] mb-2 xs:mb-4 drop-shadow-[0_0_15px_rgba(255,214,165,0.25)]">
            Knight Movement
          </h1>
        </div>

        {/* Game Description */}
        <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 mb-12 shadow-[0_20px_40px_rgba(255,214,165,0.08)] max-w-4xl w-full border border-[#FFD6A5]/15 relative overflow-hidden hover:shadow-[0_20px_40px_rgba(255,214,165,0.12)] transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFD6A5] to-[#FFF1E6]"></div>
          <div className="absolute inset-0 bg-[#FFD6A5]/5 rounded-3xl blur-xl group-hover:bg-[#FFD6A5]/8 transition-all duration-300"></div>

          <h2 className="text-3xl font-bold mb-6 text-[#FFD6A5] drop-shadow-[0_0_12px_rgba(255,214,165,0.2)]">
            About the Challenge
          </h2>
          <p className="mb-6 text-lg text-[#FFF1E6]/90 leading-relaxed">
            The Knight Movement is a classic chess puzzle where you move a knight across the board,
            visiting as many squares as possible. Each square can only be visited once,
            and the knight moves in its traditional L-shape pattern.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-[#FFD6A5] drop-shadow-[0_0_10px_rgba(255,214,165,0.2)]">
                Game Rules
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-black/20 rounded-xl border border-[#FFD6A5]/15 shadow-[0_8px_32px_rgba(255,214,165,0.05)] hover:shadow-[0_8px_32px_rgba(255,214,165,0.08)] transition-all duration-300">
                  <span className="text-[#FFD6A5] font-bold text-lg drop-shadow-[0_0_6px_rgba(255,214,165,0.25)]">L</span>
                  <span className="text-[#FFF1E6]/90">Knight moves in L-shape: two squares in one direction, then one square perpendicular</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-black/20 rounded-xl border border-[#FFD6A5]/15 shadow-[0_8px_32px_rgba(255,214,165,0.05)] hover:shadow-[0_8px_32px_rgba(255,214,165,0.08)] transition-all duration-300">
                  <span className="text-[#FFD6A5] font-bold text-lg drop-shadow-[0_0_6px_rgba(255,214,165,0.25)]">1</span>
                  <span className="text-[#FFF1E6]/90">Each square can only be visited once during the game</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-black/20 rounded-xl border border-[#FFD6A5]/15 shadow-[0_8px_32px_rgba(255,214,165,0.05)] hover:shadow-[0_8px_32px_rgba(255,214,165,0.08)] transition-all duration-300">
                  <span className="text-[#FFD6A5] font-bold text-lg drop-shadow-[0_0_6px_rgba(255,214,165,0.25)]">64</span>
                  <span className="text-[#FFF1E6]/90">Maximum possible score is 64 squares (complete tour)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-[#CFFAFE] drop-shadow-[0_0_10px_rgba(207,250,254,0.2)]">
                How to Play
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-black/20 rounded-xl border border-[#CFFAFE]/15 shadow-[0_8px_32px_rgba(207,250,254,0.05)] hover:shadow-[0_8px_32px_rgba(207,250,254,0.08)] transition-all duration-300">
                  <span className="text-[#CFFAFE] font-bold drop-shadow-[0_0_6px_rgba(207,250,254,0.25)]">1</span>
                  <span className="text-[#FFF1E6]/90">Click one of the 4 highlighted starting squares</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-black/20 rounded-xl border border-[#CFFAFE]/15 shadow-[0_8px_32px_rgba(207,250,254,0.05)] hover:shadow-[0_8px_32px_rgba(207,250,254,0.08)] transition-all duration-300">
                  <span className="text-[#CFFAFE] font-bold drop-shadow-[0_0_6px_rgba(207,250,254,0.25)]">2</span>
                  <span className="text-[#FFF1E6]/90">Valid moves will be highlighted with circles</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-black/20 rounded-xl border border-[#CFFAFE]/15 shadow-[0_8px_32px_rgba(207,250,254,0.05)] hover:shadow-[0_8px_32px_rgba(207,250,254,0.08)] transition-all duration-300">
                  <span className="text-[#CFFAFE] font-bold drop-shadow-[0_0_6px_rgba(207,250,254,0.25)]">3</span>
                  <span className="text-[#FFF1E6]/90">Continue moving until no valid moves remain</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-black/20 rounded-2xl border border-[#FFD6A5]/15 shadow-[0_8px_32px_rgba(255,214,165,0.05)] hover:shadow-[0_8px_32px_rgba(255,214,165,0.08)] transition-all duration-300">
            <p className="text-center text-lg text-[#FFF1E6]/90">
              <span className="font-semibold text-[#FFD6A5] drop-shadow-[0_0_10px_rgba(255,214,165,0.2)]">Strategy Tip:</span> These 4 starting positions are strategically chosen to give you the best chance for a long tour.
              Advanced players can attempt to complete a full 64-square tour from any of these positions.
            </p>
          </div>
        </div>

        {/* Game Component */}
        <div className="flex justify-center w-full mt-8">
          <KnightTour />
        </div>

    <footer className="w-full mt-16 py-8 px-4 border-t border-[#FFD6A5]/20 bg-black/30 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto flex flex-col items-center space-y-4">
        {/* First line - Made with love and social icons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          <div className="flex items-center gap-2 text-[#FFF1E6]/80 text-sm sm:text-base">
            <span>Made with</span>
            <Heart 
              size={16} 
              className="text-red-400 fill-red-400 animate-pulse" 
            />
            <span>by</span>
            <span className="font-semibold text-[#FFD6A5] drop-shadow-[0_0_8px_rgba(255,214,165,0.3)]">
              Michael Benedict
            </span>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/michael-0007a"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-2 rounded-full bg-black/40 border border-[#FFD6A5]/20 hover:border-[#FFD6A5]/40 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(255,214,165,0.2)]"
              aria-label="GitHub"
            >
              <div className="absolute inset-0 bg-[#FFD6A5]/0 group-hover:bg-[#FFD6A5]/10 rounded-full transition-all duration-300"></div>
              <Github 
                size={18} 
                className="text-[#FFF1E6]/70 group-hover:text-[#FFD6A5] transition-colors duration-300 relative z-10" 
              />
            </a>

            <a
              href="https://www.instagram.com/michael_0007a/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-2 rounded-full bg-black/40 border border-[#FFD6A5]/20 hover:border-[#FFD6A5]/40 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(255,214,165,0.2)]"
              aria-label="Instagram"
            >
              <div className="absolute inset-0 bg-[#FFD6A5]/0 group-hover:bg-[#FFD6A5]/10 rounded-full transition-all duration-300"></div>
              <Instagram 
                size={18} 
                className="text-[#FFF1E6]/70 group-hover:text-[#FFD6A5] transition-colors duration-300 relative z-10" 
              />
            </a>

            <a
              href="https://www.linkedin.com/in/r-michael-benedict-"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-2 rounded-full bg-black/40 border border-[#FFD6A5]/20 hover:border-[#FFD6A5]/40 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(255,214,165,0.2)]"
              aria-label="LinkedIn"
            >
              <div className="absolute inset-0 bg-[#FFD6A5]/0 group-hover:bg-[#FFD6A5]/10 rounded-full transition-all duration-300"></div>
              <Linkedin 
                size={18} 
                className="text-[#FFF1E6]/70 group-hover:text-[#FFD6A5] transition-colors duration-300 relative z-10" 
              />
            </a>
          </div>
        </div>

        {/* Second line - Copyright */}
        <div className="text-[#FFF1E6]/60 text-xs sm:text-sm text-center">
          <p>© 2025 KnightMovement. All rights reserved.</p>
        </div>
      </div>
    </footer>
      </div>
    </main>
  );
}
