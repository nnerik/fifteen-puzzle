import React from "react";
import "./Board.css";
import { isMoveable } from "fifteen-core";

const Tile = props => {
  if (props.index === 0) return null;
  return (
    <svg
      id={props.index}
      className={props.solved ? "Solved" : "Unsolved"}
      x={(props.x - 1) * props.size}
      y={(props.y - 1) * props.size}
      height={props.size * 3}
      width={props.size * 3}
      viewBox="0 0 300 300"
    >
      <g
        className={
          props.moveable
            ? props.x < props.x0
              ? "Clickable Left"
              : props.x > props.x0
              ? "Clickable Right"
              : props.y < props.y0
              ? "Clickable Up"
              : props.y > props.y0
              ? "Clickable Down"
              : "Clickable"
            : props.x < props.x0
            ? "Left"
            : props.x > props.x0
            ? "Right"
            : props.y < props.y0
            ? "Up"
            : props.y > props.y0
            ? "Down"
            : "Still"
        }
        onClick={props.moveable ? () => props.handler(props.index) : undefined}
      >
        <rect
          className="Tile"
          style={{
            strokeWidth: 2
          }}
          x={102}
          y={102}
          rx={3}
          ry={3}
          width={96}
          height={96}
        ></rect>
        <text
          className="TileText"
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
  const boardStroke = props.frameWidth;

  return (
    <svg
      width={props.tileSize * props.width + 2 * boardStroke}
      height={props.tileSize * props.height + 2 * boardStroke}
    >
      <rect
        className="Board"
        style={{
          strokeWidth: boardStroke
        }}
        x={boardStroke / 2}
        y={boardStroke / 2}
        rx={3}
        ry={3}
        width={props.tileSize * props.width + boardStroke}
        height={props.tileSize * props.height + boardStroke}
      />
      <svg
        x={boardStroke}
        y={boardStroke}
        width={props.tileSize * props.width}
        height={props.tileSize * props.height}
      >
        {props.board.map((tile, index) => {
          return (
            <Tile
              size={props.tileSize}
              x={tile % props.width}
              y={(tile / props.width) | 0}
              x0={props.prevBoard[index] % props.width}
              y0={(props.prevBoard[index] / props.width) | 0}
              index={index}
              solved={props.solved}
              moveable={
                !props.solved && isMoveable(props.board, props.width, index)
              }
              handler={props.handler}
            />
          );
        })}
      </svg>
    </svg>
  );
};
