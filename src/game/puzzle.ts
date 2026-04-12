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

type SearchNode = {
  board: Board;
  score: number;
};

type VisitedNode = {
  gScore: number;
  hScore: number;
  from: Board | null;
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

const isIncreasing = ([previous, ...rest]: number[]): boolean => {
  const next = rest[0];

  if (previous === undefined || next === undefined) {
    return true;
  }

  return previous <= next && isIncreasing(rest);
};

const partition = <T>(items: T[], size: number): T[][] => {
  const rows: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }

  return rows;
};

const transpose = <T>(matrix: T[][]): T[][] => {
  const firstRow = matrix[0];

  if (firstRow === undefined) {
    return [];
  }

  return firstRow.map((_, index) =>
    matrix.flatMap(row => {
      const value = row[index];
      return value === undefined ? [] : [value];
    })
  );
};

const reversals = (board: Board): number => {
  const [, ...tiles] = board.state;
  const rows = partition(tiles, board.width);

  const rowReversals = rows
    .map((row, index) =>
      row.filter(value => Math.trunc(value / board.width) === index)
    )
    .filter(sequence => !isIncreasing(sequence)).length;

  const columnReversals = transpose(rows)
    .map((row, index) => row.filter(value => value % board.width === index))
    .filter(sequence => !isIncreasing(sequence)).length;

  return rowReversals + columnReversals;
};

const boardKey = (board: Board): string => board.state.join(",");

const queueIsEmpty = (queue: SearchNode[]): boolean => queue.length === 0;

const push = (queue: SearchNode[], board: Board, score: number): void => {
  let index = queue.length;
  let parent = Math.trunc((index - 1) / 2);

  queue.push({ board, score });

  while (index > 0 && (queue[index]?.score ?? 0) > (queue[parent]?.score ?? 0)) {
    [queue[index], queue[parent]] = [
      queue[parent] as SearchNode,
      queue[index] as SearchNode
    ];
    index = parent;
    parent = Math.trunc((index - 1) / 2);
  }
};

const pop = (queue: SearchNode[]): SearchNode | undefined => queue.pop();

const getNeighbors = (board: Board): Board[] => {
  const [blank, ...tiles] = board.state;

  if (blank === undefined) {
    return [];
  }

  return tiles
    .map((position, index) =>
      distance(blank, position, board.width) === 1 ? index + 1 : 0
    )
    .filter(tile => tile > 0)
    .map(tile => moveTile(board, tile));
};

export const getSolution = (start: Board): number[] => {
  const heuristic = (board: Board): number => manhattan(board) + 2 * reversals(board);
  const queue: SearchNode[] = [];
  const visited: Record<string, VisitedNode> = {
    [boardKey(start)]: {
      gScore: 0,
      hScore: heuristic(start),
      from: null
    }
  };

  push(queue, start, heuristic(start));

  const getVisited = (board: Board): VisitedNode | undefined => visited[boardKey(board)];
  const gScore = (board: Board): number => getVisited(board)?.gScore ?? Number.POSITIVE_INFINITY;
  const hScore = (board: Board): number => getVisited(board)?.hScore ?? Number.POSITIVE_INFINITY;
  const fScore = (board: Board): number => gScore(board) + hScore(board);
  const fromBoard = (board: Board): Board | null => getVisited(board)?.from ?? null;

  const saveBoard = (board: Board, from: Board): void => {
    visited[boardKey(board)] = {
      gScore: gScore(from) + 1,
      hScore: heuristic(board),
      from
    };
  };

  const reconstructPath = (goal: Board): number[] => {
    const path: number[] = [];
    let board = goal;

    while (fromBoard(board) !== null) {
      const previous = fromBoard(board);

      if (previous === null) {
        return path;
      }

      path.unshift(previous.state.findIndex(position => position === board.state[0]));
      board = previous;
    }

    return path;
  };

  while (!queueIsEmpty(queue)) {
    const current = pop(queue)?.board;

    if (current === undefined) {
      break;
    }

    if (hScore(current) === 0) {
      return reconstructPath(current);
    }

    for (const neighbor of getNeighbors(current)) {
      if (getVisited(neighbor) === undefined || gScore(current) + 1 < gScore(neighbor)) {
        saveBoard(neighbor, current);
        push(queue, neighbor, fScore(neighbor));
      }
    }
  }

  return [];
};
