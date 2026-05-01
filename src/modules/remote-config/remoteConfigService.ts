import { Capacitor } from "@capacitor/core";
import { FirebaseRemoteConfig } from "@capacitor-firebase/remote-config";
import { getApps, initializeApp, type FirebaseOptions } from "firebase/app";

type RemoteConfigKey = "home_title" | "home_cta_text";

export interface HomeRemoteConfig {
  homeTitle: string;
  homeCtaText: string;
}

const DEFAULT_HOME_CONFIG: HomeRemoteConfig = {
  homeTitle: "Nequi",
  homeCtaText: "View To-Do",
};

const REMOTE_CONFIG_KEYS: Record<RemoteConfigKey, string> = {
  home_title: "home_title",
  home_cta_text: "home_cta_text",
};

let hasConfiguredRemoteConfig = false;

const parseFirebaseWebConfig = (): FirebaseOptions | null => {
  const {
    VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID,
    VITE_FIREBASE_MEASUREMENT_ID,
  } = import.meta.env;

  if (
    !VITE_FIREBASE_API_KEY ||
    !VITE_FIREBASE_PROJECT_ID ||
    !VITE_FIREBASE_APP_ID
  ) {
    return null;
  }

  return {
    apiKey: VITE_FIREBASE_API_KEY,
    authDomain: VITE_FIREBASE_AUTH_DOMAIN,
    projectId: VITE_FIREBASE_PROJECT_ID,
    storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: VITE_FIREBASE_APP_ID,
    measurementId: VITE_FIREBASE_MEASUREMENT_ID,
  };
};

const ensureFirebaseWebApp = (): boolean => {
  if (Capacitor.getPlatform() !== "web") {
    return true;
  }

  if (getApps().length > 0) {
    return true;
  }

  const webConfig = parseFirebaseWebConfig();
  if (!webConfig) {
    return false;
  }

  initializeApp(webConfig);
  return true;
};

const configureRemoteConfig = async (): Promise<void> => {
  if (hasConfiguredRemoteConfig) {
    return;
  }

  await FirebaseRemoteConfig.setSettings({
    fetchTimeoutInSeconds: 10,
    minimumFetchIntervalInSeconds: import.meta.env.DEV ? 0 : 3600,
  });

  hasConfiguredRemoteConfig = true;
};

const getStringOrDefault = async (
  key: string,
  fallback: string,
): Promise<string> => {
  const { value } = await FirebaseRemoteConfig.getString({ key });
  return value?.trim() ? value : fallback;
};

export const fetchHomeRemoteConfig = async (): Promise<HomeRemoteConfig> => {
  if (!ensureFirebaseWebApp()) {
    return DEFAULT_HOME_CONFIG;
  }

  try {
    await configureRemoteConfig();
    await FirebaseRemoteConfig.fetchAndActivate();

    const [homeTitle, homeCtaText] = await Promise.all([
      getStringOrDefault(
        REMOTE_CONFIG_KEYS.home_title,
        DEFAULT_HOME_CONFIG.homeTitle,
      ),
      getStringOrDefault(
        REMOTE_CONFIG_KEYS.home_cta_text,
        DEFAULT_HOME_CONFIG.homeCtaText,
      ),
    ]);

    return {
      homeTitle,
      homeCtaText,
    };
  } catch {
    return DEFAULT_HOME_CONFIG;
  }
};
