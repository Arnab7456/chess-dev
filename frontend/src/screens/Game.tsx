
import { Chess } from 'chess.js';
import { ChessBoard } from '../components/ChessBoard';
import { Button } from '../components/Button';
import { useSocket } from '../hooks/useSocket';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "GAME_OVER";



export const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [started, setStarted] = useState(false);
    const [moveLog, setMoveLog] = useState<string[]>([]); // State to track the move log
  
    useEffect(() => {
      if (!socket) return;
  
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        switch (message.type) {
          case INIT_GAME: {
            setBoard(chess.board());
            setStarted(true);
            setMoveLog([]); // Reset the move log when a new game starts
            console.log("Game Initialized");
            break;
          }
          case MOVE: {
            const move = message.payload;
            chess.move(move);
            setChess(new Chess(chess.fen()));
            setBoard(chess.board());
  
            // Log the move with player color
            const player = chess.turn() === 'w' ? 'White' : 'Black';
            const moveString = `${player}: ${move.from} → ${move.to}`;
            setMoveLog((prevLog) => [...prevLog, moveString]);
  
            console.log("Move Made:", move);
            break;
          }
          case GAME_OVER: {
            console.log("Game Over");
            setStarted(false);
            break;
          }
          default: {
            console.log("Unknown message type:", message.type);
            break;
          }
        }
      };
    }, [socket, chess]);
  
    if (!socket)
      return (
        <div className="min-h-screen flex items-center justify-center text-white text-lg">
          loading.....
        </div>
      );
  
    return (
      <div className="min-h-screen pt-14 bg-gray-900 text-white">
        <div className="max-w-screen-xl mx-auto space-y-6">
          {/* Mobile layout */}
          <div className="lg:hidden space-y-6">
            <motion.div
              className="w-full aspect-square" // This ensures the chessboard keeps a square shape
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ChessBoard
                chess={chess}
                setBoard={setBoard}
                socket={socket}
                board={board}
              />
            </motion.div>
            <motion.div
              className="w-full bg-slate-800 rounded-lg p-6 flex justify-center shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {!started ? (
                <Button
                  onClick={() => {
                    socket.send(
                      JSON.stringify({
                        type: INIT_GAME,
                      })
                    );
                  }}
                >
                  Play
                </Button>
              ) : (
                <div className="text-white text-lg">Game in Progress...</div>
              )}
            </motion.div>
          </div>
  
          {/* Desktop layout */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6 w-full">
            <div className="col-span-8 w-full flex justify-center">
              <motion.div
                className="w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ChessBoard
                  chess={chess}
                  setBoard={setBoard}
                  socket={socket}
                  board={board}
                />
              </motion.div>
            </div>
            <div className="col-span-4 bg-slate-800 rounded-lg p-6 flex justify-center items-center shadow-lg">
              <motion.div
                className="pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {!started ? (
                  <Button
                    onClick={() => {
                      socket.send(
                        JSON.stringify({
                          type: INIT_GAME,
                        })
                      );
                    }}
                  >
                    Play
                  </Button>
                ) : (
                  <div className="text-white text-lg">Game in Progress...</div>
                )}
              </motion.div>
            </div>
          </div>
  
          {/* Display move log */}
          {moveLog.length > 0 && (
            <div className="bg-gray-800 p-4 rounded-lg mt-6">
              <h2 className="text-xl text-white mb-2">Move Log</h2>
              <ul className="text-white text-sm">
                {moveLog.map((move, index) => (
                  <li key={index} className="mb-1">{move}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };
  