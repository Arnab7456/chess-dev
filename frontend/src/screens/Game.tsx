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
        if (!socket) {
            return;
        }

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            switch (message.type) {
                case INIT_GAME:
                    setBoard(chess.board());
                    setStarted(true);
                    console.log("Game Initialized");
                    break;
                case MOVE:
                    const move = message.payload;
                    chess.move(move);
                    setChess(new Chess(chess.fen())); // Update the chess state
                    setBoard(chess.board()); // Update the board state
                    console.log("Move Made");
                    break;
                case GAME_OVER:
                    console.log("Game Over");
                    setStarted(false); // Reset started to false when the game is over
                    break;
            }
        };
    }, [socket, chess]); // Added chess to the dependency array

    if (!socket) return <div>wait for Golden God's permission</div>;

    return (
        <div className="justify-center flex">
            <div className="pt-8 max-w-screen-lg w-full">
                <div className="grid grid-cols-6 gap-4 w-full">
                    <div className="col-span-4 w-full flex justify-center">
                        <ChessBoard chess={chess} setBoard={setBoard} socket={socket} board={board} />
                    </div>
                    <div className="col-span-2 bg-slate-900 w-full flex justify-center">
                        <div className="pt-8">
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
                                <div className="text-white">Game in Progress...</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
