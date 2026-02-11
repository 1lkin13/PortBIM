import { createBrowserRouter } from "react-router-dom";
import React from "react";
import Layout from "../../features/shared/components/layout/Layout";

const DesignersPage = React.lazy(() => import("../../pages/DesignersPage"));
const EditorPage = React.lazy(() => import("../../pages/EditorPage"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <DesignersPage />
      </Layout>
    ),
  },
  {
    path: "/designers",
    element: (
      <Layout>
        <DesignersPage />
      </Layout>
    ),
  },
  {
    path: "/editor",
    element: (
      <Layout>
        <EditorPage />
      </Layout>
    ),
  },
]);
