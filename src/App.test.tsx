import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import App from "./App";

const mockGetSolution = vi.hoisted(() => vi.fn());

vi.mock("./game/solver", () => ({
  getSolution: mockGetSolution,
}));

beforeEach(() => {
  mockGetSolution.mockReturnValue({ status: "already-solved", moves: [] });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

it("renders without crashing", () => {
  const { getByText } = render(<App />);

  expect(getByText("Fifteen")).toBeTruthy();
});

it("does not alert when solving an already solved board", () => {
  const alert = vi.spyOn(window, "alert").mockImplementation(() => undefined);
  const { getByRole } = render(<App />);

  fireEvent.click(getByRole("button", { name: "Solve" }));

  expect(alert).not.toHaveBeenCalled();
});

it("alerts when the solver reaches its expansion limit", () => {
  mockGetSolution.mockReturnValue({ status: "limit-reached", moves: [] });
  const alert = vi.spyOn(window, "alert").mockImplementation(() => undefined);
  const { getByRole } = render(<App />);

  fireEvent.click(getByRole("button", { name: "Solve" }));

  expect(alert).toHaveBeenCalledWith("No solution found!");
});

it("keeps settings open while interacting with popper content", () => {
  const { getByLabelText, getByText } = render(<App />);

  fireEvent.click(getByLabelText("settings"));
  fireEvent.click(getByText("Rows"));

  expect(getByText("Rows")).toBeTruthy();
  expect(getByText("Columns")).toBeTruthy();
});
