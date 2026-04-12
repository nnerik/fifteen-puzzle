import { getManhattanDistance, isSolved, moveTile, type Board } from "./puzzle";

type SearchNode = {
  board: Board;
  gScore: number;
  priority: number;
};

type VisitedNode = {
  gScore: number;
  from: Board | null;
};

/** Options that tune solver cost and search limits. */
export type SolverOptions = {
  /** Maximum search nodes to expand before giving up. */
  maxExpandedNodes?: number;
  /** Heuristic multiplier; values above 1 trade optimality for speed. */
  weight?: number;
};

export type Solution =
  | {
      status: "already-solved";
      moves: [];
    }
  | {
      status: "found";
      moves: number[];
    }
  | {
      status: "limit-reached";
      moves: [];
    };

const defaultOptions = {
  maxExpandedNodes: 250_000,
  weight: 1.5,
} satisfies Required<SolverOptions>;

class PriorityQueue {
  #nodes: SearchNode[] = [];

  get isEmpty(): boolean {
    return this.#nodes.length === 0;
  }

  push(node: SearchNode): void {
    this.#nodes.push(node);
    this.#bubbleUp(this.#nodes.length - 1);
  }

  pop(): SearchNode | undefined {
    const first = this.#nodes[0];
    const last = this.#nodes.pop();

    if (first === undefined || last === undefined) {
      return undefined;
    }

    if (this.#nodes.length > 0) {
      this.#nodes[0] = last;
      this.#bubbleDown(0);
    }

    return first;
  }

  #bubbleUp(index: number): void {
    let child = index;

    while (child > 0) {
      const parent = Math.trunc((child - 1) / 2);

      if (this.#compare(child, parent) >= 0) {
        return;
      }

      this.#swap(child, parent);
      child = parent;
    }
  }

  #bubbleDown(index: number): void {
    let parent = index;

    while (true) {
      const left = 2 * parent + 1;
      const right = left + 1;
      let smallest = parent;

      if (left < this.#nodes.length && this.#compare(left, smallest) < 0) {
        smallest = left;
      }

      if (right < this.#nodes.length && this.#compare(right, smallest) < 0) {
        smallest = right;
      }

      if (smallest === parent) {
        return;
      }

      this.#swap(parent, smallest);
      parent = smallest;
    }
  }

  #compare(a: number, b: number): number {
    const nodeA = this.#nodes[a];
    const nodeB = this.#nodes[b];

    if (nodeA === undefined || nodeB === undefined) {
      return 0;
    }

    return nodeA.priority - nodeB.priority || nodeA.gScore - nodeB.gScore;
  }

  #swap(a: number, b: number): void {
    [this.#nodes[a], this.#nodes[b]] = [
      this.#nodes[b] as SearchNode,
      this.#nodes[a] as SearchNode,
    ];
  }
}

const boardKey = (board: Board): string => board.state.join(",");

const countConflicts = (goalPositions: number[]): number => {
  let conflicts = 0;

  for (let left = 0; left < goalPositions.length; left += 1) {
    for (let right = left + 1; right < goalPositions.length; right += 1) {
      const leftGoal = goalPositions[left];
      const rightGoal = goalPositions[right];

      if (
        leftGoal !== undefined &&
        rightGoal !== undefined &&
        leftGoal > rightGoal
      ) {
        conflicts += 1;
      }
    }
  }

  return conflicts;
};

const linearConflicts = (board: Board): number => {
  let conflicts = 0;
  const tilesByPosition = Array.from(
    { length: board.state.length },
    (_, position) =>
      board.state.findIndex((tilePosition) => tilePosition === position),
  );

  // A row conflict means two tiles are already in their goal row but reversed
  // relative to their goal columns. Resolving it costs at least two moves.
  for (let row = 0; row < board.height; row += 1) {
    const goalColumns: number[] = [];

    for (let column = 0; column < board.width; column += 1) {
      const position = row * board.width + column;
      const tile = tilesByPosition[position];

      if (
        tile !== undefined &&
        tile > 0 &&
        Math.trunc((tile - 1) / board.width) === row
      ) {
        goalColumns.push((tile - 1) % board.width);
      }
    }

    conflicts += countConflicts(goalColumns);
  }

  // Column conflicts mirror row conflicts using goal rows instead.
  for (let column = 0; column < board.width; column += 1) {
    const goalRows: number[] = [];

    for (let row = 0; row < board.height; row += 1) {
      const position = row * board.width + column;
      const tile = tilesByPosition[position];

      if (
        tile !== undefined &&
        tile > 0 &&
        (tile - 1) % board.width === column
      ) {
        goalRows.push(Math.trunc((tile - 1) / board.width));
      }
    }

    conflicts += countConflicts(goalRows);
  }

  return conflicts;
};

/**
 * Estimates distance to the solved state using Manhattan distance plus linear
 * conflict penalties.
 */
export const heuristic = (board: Board): number =>
  getManhattanDistance(board) + 2 * linearConflicts(board);

const getNeighbors = (board: Board): Board[] => {
  const blank = board.state[0];

  if (blank === undefined) {
    return [];
  }

  const blankRow = Math.trunc(blank / board.width);
  const blankColumn = blank % board.width;
  const positions = [
    blankRow > 0 ? blank - board.width : undefined,
    blankRow < board.height - 1 ? blank + board.width : undefined,
    blankColumn > 0 ? blank - 1 : undefined,
    blankColumn < board.width - 1 ? blank + 1 : undefined,
  ];

  return positions.flatMap((position) => {
    if (position === undefined) {
      return [];
    }

    const tile = board.state.findIndex(
      (tilePosition) => tilePosition === position,
    );
    return tile > 0 ? [moveTile(board, tile)] : [];
  });
};

const reconstructPath = (
  goal: Board,
  visited: Record<string, VisitedNode>,
): number[] => {
  const path: number[] = [];
  let board = goal;
  let node = visited[boardKey(board)];

  while (node?.from !== null && node?.from !== undefined) {
    path.unshift(
      node.from.state.findIndex((position) => position === board.state[0]),
    );
    board = node.from;
    node = visited[boardKey(board)];
  }

  return path;
};

/**
 * Finds a move sequence that solves the board using weighted A* search.
 */
export const getSolution = (
  start: Board,
  options: SolverOptions = {},
): Solution => {
  if (isSolved(start)) {
    return { status: "already-solved", moves: [] };
  }

  const maxExpandedNodes =
    options.maxExpandedNodes ?? defaultOptions.maxExpandedNodes;
  const weight = options.weight ?? defaultOptions.weight;
  const queue = new PriorityQueue();
  const visited: Record<string, VisitedNode> = {
    [boardKey(start)]: {
      gScore: 0,
      from: null,
    },
  };

  queue.push({
    board: start,
    gScore: 0,
    priority: weight * heuristic(start),
  });

  let expandedNodes = 0;

  while (!queue.isEmpty && expandedNodes < maxExpandedNodes) {
    const current = queue.pop();

    if (current === undefined) {
      break;
    }

    const currentKey = boardKey(current.board);
    const currentVisited = visited[currentKey];

    // A better route to this board may have been queued after this entry. The
    // visited g-score check discards stale heap entries without needing delete.
    if (
      currentVisited === undefined ||
      current.gScore !== currentVisited.gScore
    ) {
      continue;
    }

    if (isSolved(current.board)) {
      return {
        status: "found",
        moves: reconstructPath(current.board, visited),
      };
    }

    expandedNodes += 1;

    for (const neighbor of getNeighbors(current.board)) {
      const neighborKey = boardKey(neighbor);
      const gScore = current.gScore + 1;
      const visitedNeighbor = visited[neighborKey];

      if (visitedNeighbor !== undefined && gScore >= visitedNeighbor.gScore) {
        continue;
      }

      visited[neighborKey] = {
        gScore,
        from: current.board,
      };
      queue.push({
        board: neighbor,
        gScore,
        priority: gScore + weight * heuristic(neighbor),
      });
    }
  }

  return { status: "limit-reached", moves: [] };
};
