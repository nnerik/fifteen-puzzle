// Create a solved board of size width x height.
export const solvedBoard = (width, height) => {
  return [width * height - 1].concat([...Array(width * height - 1).keys()]);
};

const distance = (a, b, width) =>
  Math.abs(((a / width) | 0) - ((b / width) | 0)) +
  Math.abs((a % width) - (b % width));

export const isMoveable = (board, width, tile) =>
  distance(board[tile], board[0], width) === 1;

const manhattan = ([_, ...board], width) => {
  return board
    .map((pos, index) => distance(pos, index, width))
    .reduce((prev = 0, cur) => prev + cur);
};

export const isSolved = (board, width) => manhattan(board, width) === 0;

// Randomly shuffle the elements of an array in an even permutation.
const permuteEven = arr => {
  if (arr.length < 3) return arr;
  else {
    const newArray = [...arr];
    let parity = 0;
    for (let i = 0; i < arr.length - 2; i++) {
      const randomIndex = Math.trunc(Math.random() * (arr.length - i));
      if (randomIndex > 0) {
        const temp = newArray[i];
        newArray[i] = newArray[i + randomIndex];
        newArray[i + randomIndex] = temp;
        parity += 1;
      }
    }
    if (parity % 2 > 0) {
      const temp = newArray[arr.length - 2];
      newArray[arr.length - 2] = newArray[arr.length - 1];
      newArray[arr.length - 1] = temp;
    }
    return newArray;
  }
};

// Create a new shuffled board of size width x height.
export const newBoard = (width = 4, height = 4) => {
  return [width * height - 1].concat(
    permuteEven([...Array(width * height - 1).keys()])
  );
};

export const moveTile = (board, tile) => {
  const newBoard = [...board];
  newBoard[0] = board[tile];
  newBoard[tile] = board[0];
  return newBoard;
};

/*
 * Helper functions
 */

const increasing = ([prev, ...rest]) => {
  if (rest.length === 0) return true;
  if (prev > rest[0]) return false;
  return increasing(rest);
};

const partition = (list, n, acc = []) => {
  if (list.length <= n) return acc.concat([list]);
  return partition(list.slice(n), n, acc.concat([list.slice(0, n)]));
};

const transpose = matrix => matrix[0].map((_, i) => matrix.map(row => row[i]));

const reversals = ([_, ...board], width) =>
  partition(board, width)
    .map((row, index) =>
      row.filter(value => Math.trunc(value / width) === index)
    )
    .filter(seq => !increasing(seq)).length +
  transpose(partition(board, width))
    .map((row, index) => row.filter(value => value % width === index))
    .filter(seq => !increasing(seq)).length;

/*
 * Prority queue implementation
 */

const isEmpty = pqueue => pqueue.length === 0;

const push = (pqueue, node, score) => {
  let index = pqueue.length;
  let parent = Math.trunc((index - 1) / 2);

  pqueue.push({ node: node, score: score });

  while (index > 0 && pqueue[index].score > pqueue[parent].score) {
    const temp = pqueue[index];
    pqueue[index] = pqueue[parent];
    pqueue[parent] = temp;
    index = parent;
    parent = Math.trunc((index - 1) / 2);
  }
};

const pop = pqueue => pqueue.pop();
/*
 * Find shortest solution using A*.
 */

export const getSolution = (start, width, interval) => {
  // Record start time. We will return prematurely if it takes too long.
  const timeLimit = new Date().getTime() + interval;

  // Define the heuristic to be applied
  const heuristic = node => manhattan(node, width) + 2 * reversals(node, width);

  // We need a priority queue for the A* algorithm
  let queue = [];
  push(queue, start, heuristic(start));

  // We also need a database for visited nodes
  let nodes = {};
  nodes[start] = {
    gScore: 0,
    hScore: heuristic(start),
    from: null
  };

  const saveNode = (node, fromNode) => {
    const gScore = nodes[fromNode].gScore + 1;
    const hScore = heuristic(node);
    nodes[node] = {
      gScore: gScore,
      hScore: hScore,
      from: fromNode
    };
  };

  const gScore = node => nodes[node].gScore;
  const hScore = node => nodes[node].hScore;
  const fScore = node => gScore(node) + hScore(node);
  const fromNode = node => nodes[node].from;
  const isVisited = node => node in nodes;

  // Return list of moves for the shortest path to the goal
  const reconstructPath = goal => {
    let path = [];
    let node = goal;
    while (fromNode(node) != null) {
      const tile = fromNode(node).findIndex(pos => pos === node[0]);
      path = [tile, ...path];
      node = fromNode(node);
    }
    return path;
  };

  // Return list of neigboring boards
  const neighbors = ([blank, ...tiles]) =>
    tiles
      .map((pos, index) => (distance(blank, pos, width) === 1 ? index + 1 : 0))
      .filter(tile => tile > 0)
      .map(tile => moveTile([blank, ...tiles], tile));

  // Main A* loop
  while (!isEmpty(queue)) {
    const current = pop(queue).node;
    if (hScore(current) === 0) {
      return reconstructPath(current);
      // } else if (new Date().getTime() > timeLimit && current != start) {
      //   return reconstructPath(current);
    }

    for (const neighbor of neighbors(current)) {
      if (!isVisited(neighbor) || gScore(current) + 1 < gScore(neighbor)) {
        saveNode(neighbor, current);
        push(queue, neighbor, fScore(neighbor));
      }
    }
  }
  alert("No solution found!");
  return [];
};
