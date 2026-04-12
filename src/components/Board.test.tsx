import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createSolvedBoard, moveTile, type GameState } from "../game/puzzle";
import { Board } from "./Board";

afterEach(cleanup);

const createOneMoveGame = (): GameState => {
  const previousBoard = createSolvedBoard(3, 3);

  return {
    board: moveTile(previousBoard, 8),
    previousBoard,
    moves: 0,
  };
};

const renderBoard = (onMove = vi.fn(), isDisabled = false) =>
  render(
    <Board
      frameWidth={4}
      gameState={createOneMoveGame()}
      isDisabled={isDisabled}
      onMove={onMove}
      tileSize={100}
    />,
  );

describe("Board", () => {
  it("calls onMove when a movable tile is clicked", () => {
    const onMove = vi.fn();
    const { getByRole } = renderBoard(onMove);

    fireEvent.click(getByRole("button", { name: "Move tile 8" }));

    expect(onMove).toHaveBeenCalledWith(8);
  });

  it("supports keyboard moves for movable tiles", () => {
    const onMove = vi.fn();
    const { getByRole } = renderBoard(onMove);
    const tile = getByRole("button", { name: "Move tile 8" });

    fireEvent.keyDown(tile, { key: "Enter" });
    fireEvent.keyDown(tile, { key: " " });

    expect(onMove).toHaveBeenCalledTimes(2);
    expect(onMove).toHaveBeenNthCalledWith(1, 8);
    expect(onMove).toHaveBeenNthCalledWith(2, 8);
  });

  it("does not expose tiles as buttons while disabled", () => {
    const { queryByRole } = renderBoard(vi.fn(), true);

    expect(queryByRole("button", { name: "Move tile 8" })).toBeNull();
  });
});
