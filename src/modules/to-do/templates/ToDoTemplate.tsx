import { IonContent } from "@ionic/react";
import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import CategoryHeader from "../components/CategoryHeader";
import ToDoList from "../components/TodoList";
import { useTodoStore } from "../useTodoStore";

const ToDoTemplate: React.FC = () => {
  const categories = useTodoStore(useShallow((s) => s.categories));
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  const selectedCategoryExists = useMemo(
    () =>
      selectedCategoryId === null
        ? true
        : categories.some((category) => category.id === selectedCategoryId),
    [categories, selectedCategoryId],
  );

  useEffect(() => {
    if (!selectedCategoryExists && selectedCategoryId !== null) {
      setSelectedCategoryId(null);
    }
  }, [selectedCategoryExists, selectedCategoryId]);

  return (
    <IonContent fullscreen>
      <CategoryHeader
        selectedCategoryId={selectedCategoryId}
        onSelectedCategoryChange={setSelectedCategoryId}
      />
      <ToDoList selectedCategoryId={selectedCategoryId} />
    </IonContent>
  );
};

export default ToDoTemplate;
