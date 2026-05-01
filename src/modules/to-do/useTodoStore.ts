import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Category {
  id: number;
  name: string;
}

export interface ToDo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  categoryId?: number;
}

interface AddToDoInput {
  title: string;
  description: string;
  categoryId?: number;
}

interface TodoStore {
  categories: Category[];
  todos: ToDo[];
  addCategory: (name: string) => Category;
  deleteCategory: (categoryId: number) => void;
  addTodo: (input: AddToDoInput) => ToDo;
  toggleTodo: (todoId: number) => void;
  deleteTodo: (todoId: number) => void;
}

const initialCategories: Category[] = [{ id: 0, name: "Personal" }];

const initialTodos: ToDo[] = [
  {
    id: 0,
    title: "Buy Groceries",
    description: "Milk, Bread, Eggs, Cheese",
    completed: false,
    categoryId: 0,
  },
  {
    id: 1,
    title: "Call Mom",
    description: "Check in and say hi",
    completed: false,
  },
  {
    id: 2,
    title: "Finish Project",
    description: "Complete the final report and submit by Friday",
    completed: false,
  },
  {
    id: 3,
    title: "Workout",
    description: "Go for a run or hit the gym",
    completed: false,
  },
];

const getNextId = (items: Array<{ id: number }>) =>
  items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 0;

export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      categories: initialCategories,
      todos: initialTodos,

      addCategory: (name: string) => {
        const trimmedName = name.trim();

        let createdCategory: Category = { id: -1, name: trimmedName };

        set((state) => {
          const newCategory: Category = {
            id: getNextId(state.categories),
            name: trimmedName,
          };
          createdCategory = newCategory;
          return {
            categories: [...state.categories, newCategory],
          };
        });

        return createdCategory;
      },

      deleteCategory: (categoryId: number) =>
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== categoryId),
          todos: state.todos.map((todo) =>
            todo.categoryId === categoryId
              ? {
                  ...todo,
                  categoryId: undefined,
                }
              : todo,
          ),
        })),

      addTodo: (input: AddToDoInput) => {
        let createdTodo: ToDo = {
          id: -1,
          title: input.title,
          description: input.description,
          completed: false,
          categoryId: input.categoryId,
        };

        set((state) => {
          const newTodo: ToDo = {
            id: getNextId(state.todos),
            title: input.title,
            description: input.description,
            completed: false,
            categoryId: input.categoryId,
          };
          createdTodo = newTodo;
          return {
            todos: [...state.todos, newTodo],
          };
        });

        return createdTodo;
      },

      toggleTodo: (todoId: number) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === todoId
              ? {
                  ...todo,
                  completed: !todo.completed,
                }
              : todo,
          ),
        })),

      deleteTodo: (todoId: number) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== todoId),
        })),
    }),
    {
      name: "todo-store-v1",
    },
  ),
);
