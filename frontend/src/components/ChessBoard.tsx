import { Color, PieceSymbol, Square } from "chess.js";
import { useEffect, useState } from "react";
import { MOVE } from "../screens/Game";

export const ChessBoard = ({
  board,
  socket,
  setBoard,
  chess,
}: {
  chess: any;
  setBoard: any;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
}) => {
  const [from, setFrom] = useState<null | Square>(null);

  useEffect(() => {
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === MOVE) {
        const { from, to } = message.payload.move;
        try {
          const moveResult = chess.move({ from, to });
          if (moveResult) {
            setBoard(chess.board());
          } else {
            console.error("Invalid move received:", from, to);
          }
        } catch (error) {
          console.error("Error processing move:", error);
        }
      }
    };

    return () => {
      socket.onmessage = null;
    };
  }, [socket, chess, setBoard]);

  return (
    <div className="max-w-screen  sm:w-full max-w-md mx-auto px-2 ">
      <div className="aspect-square w-full relative">
        {board.map((row, i) => (
          <div key={i} className="flex w-full" style={{ height: '12.5%' }}>
            {row.map((square, j) => {
              const squarerep = (String.fromCharCode(97 + j) + (8 - i)) as Square;
              return (
                <div
                  onClick={() => {
                    if (!from) {
                      setFrom(squarerep);
                    } else {
                      try {
                        const moveResult = chess.move({ from, to: squarerep });
                        if (moveResult) {
                          socket.send(
                            JSON.stringify({
                              type: MOVE,
                              payload: {
                                move: {
                                  from,
                                  to: squarerep,
                                },
                              },
                            })
                          );
                          setBoard(chess.board());
                        } else {
                          console.error("Invalid move:", from, squarerep);
                        }
                      } catch (error) {
                        console.error("Error processing move:", error);
                      } finally {
                        setFrom(null);
                      }
                    }
                  }}
                  key={j}
                  style={{ width: '12.5%' }}
                  className={`aspect-square relative touch-manipulation
                    ${(i + j) % 2 === 0 ? "bg-green-500" : "bg-white"}
                    ${from === squarerep ? "ring-2 ring-yellow-400 ring-inset" : ""}
                    ${from ? "hover:bg-yellow-200 transition-colors" : ""}
                  `}
                >
                  {square && (
                    <div className="absolute inset-0 p-1">
                      <img
                        className={`w-full h-full object-contain select-none
                          ${square.color === "w" ? "filter invert" : ""}`}
                        src={`/${square.type.toLowerCase()}.png`}
                        alt={`${square.color} ${square.type}`}
                        draggable={false}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};