import { describe, expect, it } from "vitest";
import {
  createShuffledBoard,
  createSolvedBoard,
  moveTile,
  type Board,
} from "./puzzle";

const expectValidBoard = (board: Board) => {
  const expectedPositions = new Set(
    Array.from({ length: board.width * board.height }, (_, index) => index),
  );

  expect(board.state).toHaveLength(board.width * board.height);
  expect(new Set(board.state)).toEqual(expectedPositions);
};

const inversionCount = (values: number[]) => {
  let inversions = 0;

  for (let left = 0; left < values.length; left += 1) {
    for (let right = left + 1; right < values.length; right += 1) {
      const leftValue = values[left];
      const rightValue = values[right];

      if (
        leftValue !== undefined &&
        rightValue !== undefined &&
        leftValue > rightValue
      ) {
        inversions += 1;
      }
    }
  }

  return inversions;
};

describe("createShuffledBoard", () => {
  it("creates valid boards with even numbered-tile parity", () => {
    for (let attempt = 0; attempt < 20; attempt += 1) {
      const board = createShuffledBoard(4, 4);

      expectValidBoard(board);
      expect(board.state[0]).toBe(15);
      expect(inversionCount(board.state.slice(1)) % 2).toBe(0);
    }
  });
});

describe("moveTile", () => {
  it("swaps a legal tile with the blank", () => {
    const board = createSolvedBoard(3, 3);
    const moved = moveTile(board, 8);

    expect(moved.state[0]).toBe(7);
    expect(moved.state[8]).toBe(8);
    expect(board.state[0]).toBe(8);
  });

  it("returns the same board for an unknown tile", () => {
    const board = createSolvedBoard(3, 3);

    expect(moveTile(board, 99)).toBe(board);
  });

  it("returns the same board for a non-adjacent tile", () => {
    const board = createSolvedBoard(3, 3);

    expect(moveTile(board, 1)).toBe(board);
  });
});
