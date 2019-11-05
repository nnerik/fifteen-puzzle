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

// Create a solved board of size width x height.
export const solvedBoard = (width, height) => {
  return [width * height - 1].concat([...Array(width * height - 1).keys()]);
};

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

export const moveTile = (board, width, tile) => {
  if (isMoveable(board, width, tile)) {
    const newBoard = [...board];
    newBoard[0] = board[tile];
    newBoard[tile] = board[0];
    return newBoard;
  } else return null;
};

const candidates = ([blank, ...tiles], width) =>
  tiles
    .map((pos, index) => (distance(blank, pos, width) === 1 ? index + 1 : 0))
    .filter(tile => tile > 0);

export const getSolution = (board, width) => {
  return [candidates(board, width)[1]];
};
