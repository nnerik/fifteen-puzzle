/**
 * Puzzle board using a tile-to-position representation.
 *
 * `state[tile]` is the current board position for that tile. Tile `0` is the
 * blank space, and tile `1` belongs at position `0` in a solved board.
 */
export type Board = {
  width: number;
  height: number;
  state: number[];
};

/**
 * Runtime game state used by the UI.
 *
 * `previousBoard` is retained so tiles can animate from their previous
 * position after a move.
 */
export type GameState = {
  board: Board;
  previousBoard: Board;
  moves: number;
};

/** Creates a board in solved order for the requested dimensions. */
export const createSolvedBoard = (width: number, height: number): Board => ({
  width,
  height,
  state: [
    width * height - 1,
    ...Array.from({ length: width * height - 1 }, (_, index) => index),
  ],
});

/** Creates a new solved game state. */
export const createGameState = (width = 4, height = 4): GameState => {
  const board = createSolvedBoard(width, height);

  return {
    board,
    previousBoard: board,
    moves: 0,
  };
};

/** Returns the Manhattan distance between two board positions. */
export const getTileDistance = (a: number, b: number, width: number): number =>
  Math.abs(Math.trunc(a / width) - Math.trunc(b / width)) +
  Math.abs((a % width) - (b % width));

/** Returns whether a numbered tile is adjacent to the blank space. */
export const isMovable = (board: Board, tile: number): boolean =>
  getTileDistance(board.state[tile] ?? 0, board.state[0] ?? 0, board.width) ===
  1;

/** Returns the total Manhattan distance for all numbered tiles. */
export const getManhattanDistance = (board: Board): number => {
  const [, ...tiles] = board.state;

  return tiles
    .map((position, index) => getTileDistance(position, index, board.width))
    .reduce((previous, current) => previous + current, 0);
};

/** Returns whether every numbered tile is in its goal position. */
export const isSolved = (board: Board): boolean =>
  getManhattanDistance(board) === 0;

const permuteEven = (items: number[]): number[] => {
  if (items.length < 3) {
    return items;
  }

  const nextItems = [...items];
  let parity = 0;

  for (let index = 0; index < items.length - 2; index += 1) {
    const randomOffset = Math.trunc(Math.random() * (items.length - index));

    if (randomOffset > 0) {
      [nextItems[index], nextItems[index + randomOffset]] = [
        nextItems[index + randomOffset] as number,
        nextItems[index] as number,
      ];
      parity += 1;
    }
  }

  // Keeping the permutation even guarantees the shuffled board remains
  // reachable from the solved state for this tile-to-position model.
  if (parity % 2 > 0) {
    const penultimate = nextItems.length - 2;
    const last = nextItems.length - 1;

    [nextItems[penultimate], nextItems[last]] = [
      nextItems[last] as number,
      nextItems[penultimate] as number,
    ];
  }

  return nextItems;
};

/** Creates a randomized board that is solvable from the solved state. */
export const createShuffledBoard = (width: number, height: number): Board => ({
  width,
  height,
  state: [
    width * height - 1,
    ...permuteEven(
      Array.from({ length: width * height - 1 }, (_, index) => index),
    ),
  ],
});

/** Moves a tile by swapping it with the blank position. */
export const moveTile = (board: Board, tile: number): Board => {
  const blankPosition = board.state[0];
  const tilePosition = board.state[tile];

  if (
    blankPosition === undefined ||
    tilePosition === undefined ||
    getTileDistance(blankPosition, tilePosition, board.width) !== 1
  ) {
    return board;
  }

  const state = [...board.state];
  state[0] = tilePosition;
  state[tile] = blankPosition;

  return { ...board, state };
};
