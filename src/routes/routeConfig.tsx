// src/config/routes.ts
import { lazy } from "react";

export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  layout?: boolean;
}

// Lazy load components
const HomePage = lazy(() => import("@/pages/home/HomePage"));
const AdsList = lazy(() => import("@/pages/ads/pages/AdsList"));
const AdsSinglePage = lazy(() => import("@/pages/ads/pages/AdsSinglePage"));
const SignUpPage = lazy(() => import("@/pages/auth/sign-up/SignUpPage"));
const LevelTwoSignUp = lazy(
  () => import("@/pages/auth/component/LevelTwoSignUp")
);
const LogIn = lazy(() => import("@/pages/auth/login/LoginPage"));
const NotFound = lazy(() => import("@/components/NotFound"));
const ProfilePage = lazy(() => import("@/pages/profile/ProfilePage"));
const AdvertisementForm = lazy(
  () => import("@/pages/ads/pages/AdvertisementForm")
);
const ErrorPage = lazy(() => import("@/pages/sample/ErrorPage"));

export const routes: RouteConfig[] = [
  {
    path: "/",
    component: HomePage,
    layout: true,
  },
  {
    path: "/profile",
    component: ProfilePage,
    layout: true,
  },
  {
    path: "/ads",
    component: AdsList,
    layout: true,
  },
  {
    path: "/advertisementForm/:id",
    component: AdvertisementForm,
    layout: true,
  },
  {
    path: "/singleAd/:id",
    component: AdsSinglePage,
    layout: true,
  },
  {
    path: "/sign-up",
    component: SignUpPage,
    layout: true,
  },
  {
    path: "/sign-up-level-two",
    component: LevelTwoSignUp,
    layout: true,
  },
  {
    path: "/login",
    component: LogIn,
    layout: true,
  },

  // 404
  {
    path: "*",
    component: NotFound,
    layout: true,
  },
  {
    path: "/smapleError",
    component: ErrorPage,
    layout: true,
  },
];
