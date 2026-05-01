import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";

import CategoryHeader from "../CategoryHeader";

const storeState = {
  categories: [] as Array<{ id: number; name: string }>,
  todos: [] as Array<{
    id: number;
    title: string;
    description: string;
    completed: boolean;
    categoryId?: number;
  }>,
  addCategory: vi.fn(),
  deleteCategory: vi.fn(),
};

vi.mock("../../useTodoStore", () => ({
  useTodoStore: (selector: (state: typeof storeState) => unknown) =>
    selector(storeState),
}));

describe("CategoryHeader", () => {
  beforeEach(() => {
    storeState.categories = [];
    storeState.todos = [];
    storeState.addCategory = vi.fn();
    storeState.deleteCategory = vi.fn();
  });

  it("renders add category button", () => {
    render(
      <CategoryHeader
        selectedCategoryId={null}
        onSelectedCategoryChange={vi.fn()}
      />,
    );

    const addButton = screen.getByTestId("add-category-button");
    expect(addButton).toBeInTheDocument();
  });

  it("renders delete category button", () => {
    render(
      <CategoryHeader
        selectedCategoryId={null}
        onSelectedCategoryChange={vi.fn()}
      />,
    );

    const deleteButton = screen.getByTestId("delete-category-button");
    expect(deleteButton).toBeInTheDocument();
  });

  it("delete category button is enabled when a category is selected", () => {
    storeState.categories = [{ id: 1, name: "Work" }];

    render(
      <CategoryHeader
        selectedCategoryId={1}
        onSelectedCategoryChange={vi.fn()}
      />,
    );

    const deleteButton = screen.getByTestId("delete-category-button");
    expect(deleteButton).toBeEnabled();
  });
});
