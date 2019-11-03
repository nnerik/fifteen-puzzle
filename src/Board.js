import React from "react";
import "./Board.css";

const Piece = props => {
  if (props.index === 0) return null;
  return (
    <svg
      x={props.x * props.size}
      y={props.y * props.size}
      height={props.size}
      width={props.size}
    >
      <rect
        className="Piece"
        style={{
          strokeWidth: "2%"
        }}
        x="2%"
        y="2%"
        width="96%"
        height="96%"
      ></rect>
      <text
        className="PieceText"
        textAnchor="middle"
        alignmentBaseline="central"
        x="50%"
        y="50%"
      >
        {props.index}
      </text>
    </svg>
  );
};

export const Board = props => {
  const pieceSize = 100;
  const boardStroke = 4;

  return (
    <svg
      width={pieceSize * props.width + 2 * boardStroke}
      height={pieceSize * props.height + 2 * boardStroke}
    >
      <rect
        className="Board"
        style={{
          strokeWidth: boardStroke
        }}
        x={boardStroke / 2}
        y={boardStroke / 2}
        width={pieceSize * props.width + boardStroke}
        height={pieceSize * props.height + boardStroke}
      />
      <svg
        x={boardStroke}
        y={boardStroke}
        width={pieceSize * props.width}
        height={pieceSize * props.height}
      >
        {props.board.map((pos, index) => {
          return (
            <Piece
              size={pieceSize}
              x={pos % props.width}
              y={(pos / props.width) | 0}
              index={index}
            />
          );
        })}
      </svg>
    </svg>
  );
};
