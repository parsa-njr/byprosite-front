// src/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "@/components/shared/Loader";
import PublicRoute from "./PublicRoute";
import { routes } from "./routeConfig";

const withSuspense = (
  children: React.ReactNode,
  fallback: React.ReactNode = <Loader />
) => <Suspense fallback={fallback}>{children}</Suspense>;

const MainLayout = lazy(() => import("@/layouts/MainLayout"));

export default function AppRoutes() {
  return (
    <Routes>
      {routes.map(({ path, component: Component, layout }) => {
        const element = layout ? (
          <MainLayout>
            <Component />
          </MainLayout>
        ) : (
          <Component />
        );

        return (
          <Route
            key={path}
            path={path}
            element={withSuspense(<PublicRoute>{element}</PublicRoute>)}
          />
        );
      })}
    </Routes>
  );
}