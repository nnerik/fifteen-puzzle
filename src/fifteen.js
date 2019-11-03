export const newBoard = (heigth = 4, width = 4) => {
  return [15, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
};

export const movePiece = (board, width, height, piece) => {
  if (
    board[piece] - board[0] === width ||
    board[0] - board[piece] === width ||
    (((board[0] / width) | 0) === ((board[piece] / width) | 0) &&
      (board[piece] - board[0] === 1 || board[0] - board[piece] === 1))
  ) {
    const newBoard = [...board];
    newBoard[0] = board[piece];
    newBoard[piece] = board[0];
    return newBoard;
  } else return board;
};
