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

// Create a solved board of size width x height.
export const solvedBoard = (width = 4, height = 4) => {
  return [width * height - 1].concat([...Array(width * height - 1).keys()]);
};

export const isSolved = board => {
  if (board[0] != board.length - 1) return false;
  for (let i = 0; i < board.length - 2; i++) {
    if (board[i + 1] != i) return false;
  }
  return true;
};

export const isMoveable = (board, width, tile) => {
  return (
    board[tile] - board[0] === width ||
    board[0] - board[tile] === width ||
    (((board[0] / width) | 0) === ((board[tile] / width) | 0) &&
      (board[tile] - board[0] === 1 || board[0] - board[tile] === 1))
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
