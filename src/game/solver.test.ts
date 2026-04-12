import { describe, expect, it } from "vitest";
import { createSolvedBoard, isSolved, moveTile, type Board } from "./puzzle";
import { getSolution, heuristic } from "./solver";

const applyMoves = (board: Board, moves: number[]): Board =>
  moves.reduce((current, tile) => moveTile(current, tile), board);

const scramble = (
  width: number,
  height: number,
  blankPositions: number[],
): Board =>
  blankPositions.reduce(
    (board, blankPosition) => {
      const tile = board.state.findIndex(
        (position) => position === blankPosition,
      );
      return moveTile(board, tile);
    },
    createSolvedBoard(width, height),
  );

describe("getSolution", () => {
  it("returns no moves for a solved board", () => {
    expect(getSolution(createSolvedBoard(3, 3))).toEqual({
      status: "already-solved",
      moves: [],
    });
  });

  it("solves a board that is one move away", () => {
    const board = scramble(3, 3, [7]);

    expect(getSolution(board)).toEqual({ status: "found", moves: [8] });
  });

  it("returns a valid solution for a scrambled 3x3 board", () => {
    const board = scramble(3, 3, [7, 6, 3, 4, 5, 2, 1, 0, 3, 4]);
    const solution = getSolution(board);

    expect(solution.status).toBe("found");
    expect(solution.moves.length).toBeGreaterThan(0);
    expect(isSolved(applyMoves(board, solution.moves))).toBe(true);
  });

  it("returns a valid solution for a small 4x4 scramble", () => {
    const board = scramble(4, 4, [14, 13, 9, 10, 11, 7, 6, 10, 14, 15]);
    const solution = getSolution(board);

    expect(solution.status).toBe("found");
    expect(solution.moves.length).toBeGreaterThan(0);
    expect(isSolved(applyMoves(board, solution.moves))).toBe(true);
  });

  it("honors the expansion limit", () => {
    const board = scramble(4, 4, [14, 10, 9]);

    expect(getSolution(board, { maxExpandedNodes: 0 })).toEqual({
      status: "limit-reached",
      moves: [],
    });
  });
});

describe("heuristic", () => {
  it("adds linear conflict cost to Manhattan distance", () => {
    const board: Board = {
      width: 3,
      height: 3,
      state: [8, 1, 0, 2, 3, 4, 5, 6, 7],
    };

    expect(heuristic(board)).toBe(4);
  });
});
