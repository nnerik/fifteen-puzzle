import { isSolved, moveTile, type Board } from "./puzzle";

type SearchNode = {
  board: Board;
  gScore: number;
  priority: number;
};

type VisitedNode = {
  gScore: number;
  from: Board | null;
};

type SolverOptions = {
  maxExpandedNodes?: number;
  weight?: number;
};

const defaultOptions = {
  maxExpandedNodes: 250_000,
  weight: 1.5
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
      this.#nodes[a] as SearchNode
    ];
  }
}

const boardKey = (board: Board): string => board.state.join(",");

const distance = (a: number, b: number, width: number): number =>
  Math.abs(Math.trunc(a / width) - Math.trunc(b / width)) +
  Math.abs((a % width) - (b % width));

const manhattan = (board: Board): number => {
  const [, ...tiles] = board.state;

  return tiles
    .map((position, index) => distance(position, index, board.width))
    .reduce((previous, current) => previous + current, 0);
};

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
  const tilesByPosition = Array.from({ length: board.state.length }, (_, position) =>
    board.state.findIndex(tilePosition => tilePosition === position)
  );

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

export const heuristic = (board: Board): number =>
  manhattan(board) + 2 * linearConflicts(board);

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
    blankColumn < board.width - 1 ? blank + 1 : undefined
  ];

  return positions.flatMap(position => {
    if (position === undefined) {
      return [];
    }

    const tile = board.state.findIndex(tilePosition => tilePosition === position);
    return tile > 0 ? [moveTile(board, tile)] : [];
  });
};

const reconstructPath = (
  goal: Board,
  visited: Record<string, VisitedNode>
): number[] => {
  const path: number[] = [];
  let board = goal;
  let node = visited[boardKey(board)];

  while (node?.from !== null && node?.from !== undefined) {
    path.unshift(
      node.from.state.findIndex(position => position === board.state[0])
    );
    board = node.from;
    node = visited[boardKey(board)];
  }

  return path;
};

export const getSolution = (
  start: Board,
  options: SolverOptions = {}
): number[] => {
  const maxExpandedNodes =
    options.maxExpandedNodes ?? defaultOptions.maxExpandedNodes;
  const weight = options.weight ?? defaultOptions.weight;
  const queue = new PriorityQueue();
  const visited: Record<string, VisitedNode> = {
    [boardKey(start)]: {
      gScore: 0,
      from: null
    }
  };

  queue.push({
    board: start,
    gScore: 0,
    priority: weight * heuristic(start)
  });

  let expandedNodes = 0;

  while (!queue.isEmpty && expandedNodes < maxExpandedNodes) {
    const current = queue.pop();

    if (current === undefined) {
      break;
    }

    const currentKey = boardKey(current.board);
    const currentVisited = visited[currentKey];

    if (
      currentVisited === undefined ||
      current.gScore !== currentVisited.gScore
    ) {
      continue;
    }

    if (isSolved(current.board)) {
      return reconstructPath(current.board, visited);
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
        from: current.board
      };
      queue.push({
        board: neighbor,
        gScore,
        priority: gScore + weight * heuristic(neighbor)
      });
    }
  }

  return [];
};
