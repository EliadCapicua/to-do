import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { fetchHomeRemoteConfig } from "../../modules/remote-config/remoteConfigService";
import "./Home.css";

const Home: React.FC = () => {
  const [homeTitle, setHomeTitle] = useState("Nequi");
  const [homeCtaText, setHomeCtaText] = useState("View To-Do");

  useEffect(() => {
    const loadRemoteConfig = async () => {
      const remoteConfig = await fetchHomeRemoteConfig();
      setHomeTitle(remoteConfig.homeTitle);
      setHomeCtaText(remoteConfig.homeCtaText);
    };

    void loadRemoteConfig();
  }, []);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>{homeTitle}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{homeTitle}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding ion-text-center">
          <IonButton routerLink="/todo-page" shape="round">
            {homeCtaText}
          </IonButton>
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default Home;
