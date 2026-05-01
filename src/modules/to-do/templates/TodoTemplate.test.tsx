import { render, screen } from "@testing-library/react";
import { beforeEach, expect, test } from "vitest";
import "@testing-library/jest-dom";

import ToDoTemplate from "./ToDoTemplate";

test("renders ToDoTemplate", () => {
  beforeEach(() => {
    render(<ToDoTemplate />);
  });

  test("renders category header", () => {
    const addButton = screen.getByRole("button", { name: /add category/i });
    expect(addButton).toBeInTheDocument();
  });

  test("renders todo list", () => {
    const addButton = screen.getByRole("button", { name: /add todo/i });
    expect(addButton).toBeInTheDocument();
  });

  test("renders all category by default", () => {
    const allCategoryButton = screen.getByRole("button", { name: /all/i });
    expect(allCategoryButton).toBeInTheDocument();
  });
});
