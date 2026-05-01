import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";

import ToDoList from "../TodoList";

const storeState = {
  categories: [] as Array<{ id: number; name: string }>,
  todos: [] as Array<{
    id: number;
    title: string;
    description: string;
    completed: boolean;
    categoryId?: number;
  }>,
  addTodo: vi.fn(),
  toggleTodo: vi.fn(),
  deleteTodo: vi.fn(),
};

vi.mock("../../useTodoStore", () => ({
  useTodoStore: (selector: (state: typeof storeState) => unknown) =>
    selector(storeState),
}));

describe("ToDoList", () => {
  beforeEach(() => {
    storeState.categories = [];
    storeState.todos = [];
    storeState.addTodo = vi.fn();
    storeState.toggleTodo = vi.fn();
    storeState.deleteTodo = vi.fn();
  });

  it("renders add todo button", () => {
    render(<ToDoList selectedCategoryId={null} />);

    const addButton = screen.getByTestId("add-todo-button");
    expect(addButton).toBeInTheDocument();
  });

  it("renders title input", () => {
    render(<ToDoList selectedCategoryId={null} />);

    const titleInput = screen.getByTestId("title-input");
    expect(titleInput).toBeInTheDocument();
  });

  it("renders description input", () => {
    render(<ToDoList selectedCategoryId={null} />);

    const descriptionInput = screen.getByTestId("description-input");
    expect(descriptionInput).toBeInTheDocument();
  });

  it("renders todos based on selected category", () => {
    storeState.categories = [
      { id: 1, name: "Work" },
      { id: 2, name: "Personal" },
    ];
    storeState.todos = [
      {
        id: 1,
        title: "Work Todo",
        description: "",
        completed: false,
        categoryId: 1,
      },
      {
        id: 2,
        title: "Personal Todo",
        description: "",
        completed: false,
        categoryId: 2,
      },
      {
        id: 3,
        title: "Uncategorized Todo",
        description: "",
        completed: false,
      },
    ];

    const { rerender } = render(<ToDoList selectedCategoryId={1} />);
    expect(screen.getByText(/work todo/i)).toBeInTheDocument();
    expect(screen.queryByText(/personal todo/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/uncategorized todo/i)).not.toBeInTheDocument();

    rerender(<ToDoList selectedCategoryId={2} />);
    expect(screen.getByText(/personal todo/i)).toBeInTheDocument();
    expect(screen.queryByText(/work todo/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/uncategorized todo/i)).not.toBeInTheDocument();

    rerender(<ToDoList selectedCategoryId={null} />);
    expect(screen.getByText(/work todo/i)).toBeInTheDocument();
    expect(screen.getByText(/personal todo/i)).toBeInTheDocument();
    expect(screen.getByText(/uncategorized todo/i)).toBeInTheDocument();
  });
});
