import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
} from "@ionic/react";
import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useTodoStore } from "../useTodoStore";

interface ToDoListProps {
  selectedCategoryId: number | null;
}

const ToDoList: React.FC<ToDoListProps> = ({ selectedCategoryId }) => {
  const { categories, todos, addTodo, toggleTodo, deleteTodo } = useTodoStore(
    useShallow((s) => ({
      categories: s.categories,
      todos: s.todos,
      addTodo: s.addTodo,
      toggleTodo: s.toggleTodo,
      deleteTodo: s.deleteTodo,
    })),
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(
    selectedCategoryId,
  );

  useEffect(() => {
    setCategoryId(selectedCategoryId);
  }, [selectedCategoryId]);

  const visibleTodos = useMemo(() => {
    if (selectedCategoryId === null) {
      return todos;
    }
    return todos.filter((todo) => todo.categoryId === selectedCategoryId);
  }, [selectedCategoryId, todos]);

  const categoryNameById = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((category) => map.set(category.id, category.name));
    return map;
  }, [categories]);

  const handleAddTodo = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }
    addTodo({
      title: trimmedTitle,
      description: description.trim(),
      categoryId: categoryId ?? undefined,
    });
    setTitle("");
    setDescription("");
    setCategoryId(selectedCategoryId);
  };

  return (
    <div className="ion-padding">
      <IonCard>
        <IonCardContent>
          <IonText>
            <h3 style={{ marginTop: 0 }}>New To-Do</h3>
          </IonText>
          <IonItem>
            <IonInput
              label="Title"
              labelPlacement="stacked"
              value={title}
              onIonInput={(event) => setTitle(event.detail.value ?? "")}
              placeholder="Add a task"
              data-testid="title-input"
            />
          </IonItem>
          <IonItem>
            <IonTextarea
              label="Description"
              labelPlacement="stacked"
              value={description}
              onIonInput={(event) => setDescription(event.detail.value ?? "")}
              placeholder="Optional details"
              autoGrow
              data-testid="description-input"
            />
          </IonItem>
          <IonItem>
            <IonSelect
              label="Category"
              labelPlacement="stacked"
              value={categoryId === null ? "none" : String(categoryId)}
              onIonChange={(event) => {
                const value = event.detail.value;
                if (!value || value === "none") {
                  setCategoryId(null);
                  return;
                }
                setCategoryId(Number(value));
              }}
              data-testid="category-select"
            >
              <IonSelectOption value="none">None</IonSelectOption>
              {categories.map((category) => (
                <IonSelectOption key={category.id} value={String(category.id)}>
                  {category.name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          <IonButton
            expand="block"
            style={{ marginTop: 12 }}
            onClick={handleAddTodo}
            data-testid="add-todo-button"
          >
            Add To-Do
          </IonButton>
        </IonCardContent>
      </IonCard>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 16,
        }}
      >
        <IonText>
          <h3 style={{ margin: 0 }}>Tasks</h3>
        </IonText>
        <IonBadge>{visibleTodos.length}</IonBadge>
      </div>

      <IonList inset style={{ marginTop: 8 }}>
        {visibleTodos.map((todo) => (
          <IonItem key={todo.id}>
            <IonCheckbox
              slot="start"
              checked={todo.completed}
              onIonChange={() => toggleTodo(todo.id)}
              data-testid={`todo-checkbox-${todo.id}`}
            />
            <IonLabel>
              <h2
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                  opacity: todo.completed ? 0.7 : 1,
                }}
              >
                {todo.title}
              </h2>
              {todo.description ? <p>{todo.description}</p> : null}
              <IonNote color="medium">
                {todo.categoryId !== undefined
                  ? (categoryNameById.get(todo.categoryId) ?? "Uncategorized")
                  : "No category"}
              </IonNote>
            </IonLabel>
            <IonButton
              fill="clear"
              color="danger"
              slot="end"
              onClick={() => deleteTodo(todo.id)}
              data-testid={`delete-todo-button-${todo.id}`}
            >
              Delete
            </IonButton>
          </IonItem>
        ))}
        {visibleTodos.length === 0 ? (
          <IonItem>
            <IonLabel>
              <p>No tasks yet. Create your first one above.</p>
            </IonLabel>
          </IonItem>
        ) : null}
      </IonList>
    </div>
  );
};

export default ToDoList;
