import React, { Suspense } from "react";
import { AppwriteDesignerRepository } from "../../core/infrastructure/repositories/AppwriteDesignerRepository";
import { AppwriteObjectRepository } from "../../core/infrastructure/repositories/AppwriteObjectRepository";
import { Spinner } from "@heroui/react";

// Dependency Injection context or similar can go here if needed,
// for now we'll just export instances or use services.

export const designerRepo = new AppwriteDesignerRepository();
export const objectRepo = new AppwriteObjectRepository();

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner/>
        </div>
      }
    >
      {children}
    </Suspense>
  );
};
