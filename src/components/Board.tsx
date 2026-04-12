import "./Board.css";
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
  handler: (tile: number) => void;
  tileSize: number;
};

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

const Tile = (props: TileProps) => {
  if (props.index === 0) {
    return null;
  }

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
        className={tileStateClassName(props)}
        onClick={props.isMovable ? () => props.onMove(props.index) : undefined}
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

export const Board = (props: BoardProps) => {
  const boardStroke = props.frameWidth;
  const solved = isSolved(props.gameState.board);
  const boardWidth = props.tileSize * props.gameState.board.width;
  const boardHeight = props.tileSize * props.gameState.board.height;

  return (
    <svg
      className="Board"
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
              isMovable={!solved && isMovable(props.gameState.board, index)}
              onMove={props.handler}
            />
          );
        })}
      </svg>
    </svg>
  );
};
