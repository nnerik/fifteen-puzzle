import "./Board.css";
import type { CSSProperties, KeyboardEvent } from "react";
import { isMovable, isSolved, type GameState } from "../game/puzzle";

type TileProps = {
  index: number;
  isMovable: boolean;
  isSolved: boolean;
  onMove: (tile: number) => void;
  previousX: number;
  previousY: number;
  size: number;
  x: number;
  y: number;
};

type BoardProps = {
  frameWidth: number;
  gameState: GameState;
  isDisabled?: boolean;
  onMove: (tile: number) => void;
  tileSize: number;
};

/** Returns animation and clickability classes for a tile transition. */
const tileStateClassName = (props: TileProps): string => {
  if (props.isMovable) {
    if (props.x < props.previousX) return "Clickable Left";
    if (props.x > props.previousX) return "Clickable Right";
    if (props.y < props.previousY) return "Clickable Up";
    if (props.y > props.previousY) return "Clickable Down";
    return "Clickable";
  }

  if (props.x < props.previousX) return "Left";
  if (props.x > props.previousX) return "Right";
  if (props.y < props.previousY) return "Up";
  if (props.y > props.previousY) return "Down";
  return "Still";
};

/** Renders one numbered tile at its current SVG position. */
const Tile = (props: TileProps) => {
  if (props.index === 0) {
    return null;
  }

  const handleKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    props.onMove(props.index);
  };

  return (
    <svg
      className={props.isSolved ? "Solved" : "Unsolved"}
      x={(props.x - 1) * props.size}
      y={(props.y - 1) * props.size}
      height={props.size * 3}
      width={props.size * 3}
      viewBox="0 0 300 300"
    >
      <g
        aria-label={props.isMovable ? `Move tile ${props.index}` : undefined}
        className={tileStateClassName(props)}
        onKeyDown={props.isMovable ? handleKeyDown : undefined}
        onClick={props.isMovable ? () => props.onMove(props.index) : undefined}
        role={props.isMovable ? "button" : undefined}
        tabIndex={props.isMovable ? 0 : undefined}
      >
        <rect
          className="Tile"
          style={{ strokeWidth: 2 }}
          x={102}
          y={102}
          rx={3}
          ry={3}
          width={96}
          height={96}
        />
        <text
          className="TileText"
          textAnchor="middle"
          dominantBaseline="middle"
          x={150}
          y={150}
        >
          {props.index}
        </text>
      </g>
    </svg>
  );
};

/** Renders the puzzle board and delegates movable tile clicks. */
export const Board = (props: BoardProps) => {
  const boardStroke = props.frameWidth;
  const solved = isSolved(props.gameState.board);
  const boardWidth = props.tileSize * props.gameState.board.width;
  const boardHeight = props.tileSize * props.gameState.board.height;

  return (
    <svg
      aria-label="Sliding puzzle board"
      className="Board"
      role="group"
      style={{ "--tile-size": `${props.tileSize}px` } as CSSProperties}
      viewBox={`0 0 ${boardWidth + 2 * boardStroke} ${boardHeight + 2 * boardStroke}`}
    >
      <rect
        className="Frame"
        style={{ strokeWidth: boardStroke }}
        x={boardStroke / 2}
        y={boardStroke / 2}
        rx={3}
        ry={3}
        width={boardWidth + boardStroke}
        height={boardHeight + boardStroke}
        fillOpacity={0}
      />
      <svg
        x={boardStroke}
        y={boardStroke}
        width={boardWidth}
        height={boardHeight}
      >
        {props.gameState.board.state.map((tile, index) => {
          const previousTile = props.gameState.previousBoard.state[index] ?? 0;

          // Previous coordinates are passed through so CSS animations can infer
          // the direction each tile moved without storing a separate move type.
          return (
            <Tile
              key={index}
              size={props.tileSize}
              x={tile % props.gameState.board.width}
              y={(tile / props.gameState.board.width) | 0}
              previousX={previousTile % props.gameState.board.width}
              previousY={(previousTile / props.gameState.board.width) | 0}
              index={index}
              isSolved={solved}
              isMovable={
                !props.isDisabled &&
                !solved &&
                isMovable(props.gameState.board, index)
              }
              onMove={props.onMove}
            />
          );
        })}
      </svg>
    </svg>
  );
};
