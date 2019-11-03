import React from "react";
import "./Board.css";

const Piece = props => {
  if (props.index === 0) return null;
  return (
    <svg
      id={props.index}
      x={(props.x0 - 1) * props.size}
      y={(props.y0 - 1) * props.size}
      height={props.size * 3}
      width={props.size * 3}
      viewBox="0 0 300 300"
    >
      <g
        className={
          props.x < props.x0
            ? "Left"
            : props.x > props.x0
            ? "Right"
            : props.y < props.y0
            ? "Up"
            : props.y > props.y0
            ? "Down"
            : "Still"
        }
        onClick={() => props.handler(props.index)}
      >
        <rect
          className="Piece"
          style={{
            strokeWidth: 2
          }}
          x={102}
          y={102}
          width={96}
          height={96}
        ></rect>
        <text
          className="PieceText"
          textAnchor="middle"
          alignmentBaseline="central"
          x={150}
          y={150}
        >
          {props.index}
        </text>
      </g>
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
              x0={props.prevBoard[index] % props.width}
              y0={(props.prevBoard[index] / props.width) | 0}
              index={index}
              handler={props.handler}
            />
          );
        })}
      </svg>
    </svg>
  );
};
