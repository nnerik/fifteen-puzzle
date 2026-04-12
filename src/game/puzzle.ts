export type Board = {
  width: number;
  height: number;
  state: number[];
};

export type GameState = {
  board: Board;
  previousBoard: Board;
  moves: number;
};

export const createSolvedBoard = (width: number, height: number): Board => ({
  width,
  height,
  state: [
    width * height - 1,
    ...Array.from({ length: width * height - 1 }, (_, index) => index)
  ]
});

export const createGameState = (width = 3, height = 3): GameState => {
  const board = createSolvedBoard(width, height);

  return {
    board,
    previousBoard: board,
    moves: 0
  };
};

const distance = (a: number, b: number, width: number): number =>
  Math.abs(Math.trunc(a / width) - Math.trunc(b / width)) +
  Math.abs((a % width) - (b % width));

export const isMovable = (board: Board, tile: number): boolean =>
  distance(board.state[tile] ?? 0, board.state[0] ?? 0, board.width) === 1;

const manhattan = (board: Board): number => {
  const [, ...tiles] = board.state;

  return tiles
    .map((position, index) => distance(position, index, board.width))
    .reduce((previous, current) => previous + current, 0);
};

export const isSolved = (board: Board): boolean => manhattan(board) === 0;

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
        nextItems[index] as number
      ];
      parity += 1;
    }
  }

  if (parity % 2 > 0) {
    const penultimate = nextItems.length - 2;
    const last = nextItems.length - 1;

    [nextItems[penultimate], nextItems[last]] = [
      nextItems[last] as number,
      nextItems[penultimate] as number
    ];
  }

  return nextItems;
};

export const createShuffledBoard = (width: number, height: number): Board => ({
  width,
  height,
  state: [
    width * height - 1,
    ...permuteEven(Array.from({ length: width * height - 1 }, (_, index) => index))
  ]
});

export const moveTile = (board: Board, tile: number): Board => {
  const blankPosition = board.state[0];
  const tilePosition = board.state[tile];

  if (blankPosition === undefined || tilePosition === undefined) {
    return board;
  }

  const state = [...board.state];
  state[0] = tilePosition;
  state[tile] = blankPosition;

  return { ...board, state };
};
