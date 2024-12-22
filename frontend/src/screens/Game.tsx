import { Chess } from 'chess.js';
import { ChessBoard } from '../components/ChessBoard';
import { Button } from '../components/Button';
import { useSocket } from '../hooks/useSocket';
import { useEffect, useState } from 'react';

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "GAME_OVER";

export const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [started, setStarted] = useState(false);

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            switch (message.type) {
                case INIT_GAME: {
                    setBoard(chess.board());
                    setStarted(true);
                    console.log("Game Initialized");
                    break;
                }
                case MOVE: {
                    const move = message.payload;
                    chess.move(move);
                    setChess(new Chess(chess.fen())); 
                    setBoard(chess.board()); 
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

    if (!socket) return (
        <div className="min-h-screen flex items-center justify-center text-white text-lg">
            loading.....
        </div>
    );

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-6xl mx-auto">
                {/* Mobile layout */}
                <div className="lg:hidden space-y-6">
                    <div className="w-full">
                        <ChessBoard 
                            chess={chess} 
                            setBoard={setBoard} 
                            socket={socket} 
                            board={board} 
                        />
                    </div>
                    <div className="w-full bg-slate-900 rounded-lg p-6 flex justify-center">
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
                    </div>
                </div>

                {/* Desktop layout */}
                <div className="hidden lg:grid lg:grid-cols-6 lg:gap-6 w-full">
                    <div className="col-span-4 w-full flex justify-center">
                        <ChessBoard 
                            chess={chess} 
                            setBoard={setBoard} 
                            socket={socket} 
                            board={board} 
                        />
                    </div>
                    <div className="col-span-2 bg-slate-900 rounded-lg p-6 flex justify-center">
                        <div className="pt-4">
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};