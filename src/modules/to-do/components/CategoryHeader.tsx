import {
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonText,
} from "@ionic/react";
import { addCircleOutline, trashOutline } from "ionicons/icons";
import { useShallow } from "zustand/react/shallow";
import { useTodoStore } from "../useTodoStore";

interface CategoryHeaderProps {
  selectedCategoryId: number | null;
  onSelectedCategoryChange: (categoryId: number | null) => void;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  selectedCategoryId,
  onSelectedCategoryChange,
}) => {
  const { categories, todos, addCategory, deleteCategory } = useTodoStore(
    useShallow((s) => ({
      categories: s.categories,
      todos: s.todos,
      addCategory: s.addCategory,
      deleteCategory: s.deleteCategory,
    })),
  );

  const handleAddCategory = () => {
    const name = window.prompt("Category name");
    if (!name) {
      return;
    }
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }
    addCategory(trimmedName);
  };

  const handleDeleteCategory = () => {
    if (selectedCategoryId === null) {
      return;
    }
    const selectedCategory = categories.find(
      (category) => category.id === selectedCategoryId,
    );
    if (!selectedCategory) {
      return;
    }
    const hasTodos = todos.some(
      (todo) => todo.categoryId === selectedCategoryId,
    );
    const message = hasTodos
      ? `Delete "${selectedCategory.name}"? Todos in this category will move to All.`
      : `Delete "${selectedCategory.name}"?`;

    if (!window.confirm(message)) {
      return;
    }
    deleteCategory(selectedCategoryId);
    onSelectedCategoryChange(null);
  };

  return (
    <div className="ion-padding-horizontal ion-padding-top">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
          gap: 8,
        }}
      >
        <IonText>
          <h2 style={{ margin: 0 }}>Categories</h2>
        </IonText>
        <div style={{ display: "flex", gap: 8 }}>
          <IonButton
            fill="outline"
            size="small"
            onClick={handleAddCategory}
            data-testid="add-category-button"
          >
            <IonIcon slot="start" icon={addCircleOutline} />
            Add
          </IonButton>
          <IonButton
            fill="outline"
            color="danger"
            size="small"
            onClick={handleDeleteCategory}
            disabled={selectedCategoryId === null}
            data-testid="delete-category-button"
          >
            <IonIcon slot="start" icon={trashOutline} />
            Delete
          </IonButton>
        </div>
      </div>

      <IonSegment
        value={selectedCategoryId === null ? "all" : String(selectedCategoryId)}
        onIonChange={(event) => {
          const value = event.detail.value;
          if (!value || value === "all") {
            onSelectedCategoryChange(null);
            return;
          }
          onSelectedCategoryChange(Number(value));
        }}
        scrollable
      >
        <IonSegmentButton value="all">
          <IonText>All</IonText>
        </IonSegmentButton>
        {categories.map((category) => (
          <IonSegmentButton key={category.id} value={String(category.id)}>
            <IonText>{category.name}</IonText>
          </IonSegmentButton>
        ))}
      </IonSegment>
    </div>
  );
};

export default CategoryHeader;
