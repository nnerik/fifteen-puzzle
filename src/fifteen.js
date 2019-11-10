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
 * Find shortest solution using A* and the Manhattan heuristic.
 */

export const getSolution = (start, width) => {
  const searchDepth = 1000;

  // We need a priority queue for the A* algorithm
  const isEmpty = pqueue => !("first" in pqueue);
  const peek = pqueue => (isEmpty(pqueue) ? null : pqueue.first.value);
  const peekPri = pqueue => (isEmpty(pqueue) ? null : pqueue.first.priority);
  const pop = pqueue => ("rest" in pqueue ? pqueue.rest() : {});

  // Experimental tail recursive function
  const tailPush = (pqueue, value, priority) => {
    if (isEmpty(pqueue)) {
      return { first: { value: value, priority: priority } };
    } else if (priority <= peekPri(pqueue)) {
      return {
        first: { value: value, priority: priority },
        rest: () => pqueue
      };
    } else {
      return tailPush(
        {
          first: { value: value, priority: priority },
          rest: () => pop(pop(pqueue))
        },
        peek(pop(pqueue)),
        peekPri(pop(pqueue))
      );
    }
  };

  const push = (pqueue, value, priority) => {
    if (isEmpty(pqueue)) {
      return { first: { value: value, priority: priority } };
    } else if (priority < peekPri(pqueue)) {
      return {
        first: { value: value, priority: priority },
        rest: () => pqueue
      };
    } else {
      return {
        first: pqueue.first,
        rest: () => push(pop(pqueue), value, priority)
      };
    }
  };

  let queue = push({}, start, manhattan(start, width));

  // We also need a database for visited nodes
  let nodes = {};

  const init_hScore = manhattan(start, width);
  nodes[start] = {
    fScore: init_hScore,
    gScore: 0,
    hScore: init_hScore,
    from: null
  };

  const saveNode = (node, fromNode) => {
    const gScore = nodes[fromNode].gScore + 1;
    const hScore = manhattan(node, width);
    nodes[node] = {
      fScore: gScore + hScore,
      gScore: gScore,
      hScore: hScore,
      from: fromNode
    };
  };

  const fScore = node => nodes[node].fScore;
  const gScore = node => nodes[node].gScore;
  const hScore = node => nodes[node].hScore;
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
    const current = peek(queue);
    if (hScore(current) === 0 || hScore(current) <= init_hScore - searchDepth) {
      return reconstructPath(current);
    }

    queue = pop(queue);

    for (const neighbor of neighbors(current)) {
      if (!isVisited(neighbor) || gScore(current) + 1 < gScore(neighbor)) {
        saveNode(neighbor, current);
        queue = push(queue, neighbor, fScore(neighbor));
      }
    }
  }
  alert("No solution found!");
  return [];
};
