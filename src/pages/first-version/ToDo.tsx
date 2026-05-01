import { IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import "./Todo.css";
import ToDoTemplate from "../../modules/to-do/templates/ToDoTemplate";

const ToDo: React.FC = () => {
  return (
    <IonPage id="todo-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>View To-Do</IonTitle>
        </IonToolbar>
      </IonHeader>
      <ToDoTemplate />
    </IonPage>
  );
};

export default ToDo;
