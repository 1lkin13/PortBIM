import { RouterProvider } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./app/routes";
import { AppProvider } from "./app/providers/AppProvider";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

function App() {
  return (
    <HeroUIProvider>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <div className="text-foreground bg-background min-h-screen">
            <Toaster position="top-right" richColors />
            <RouterProvider router={router} />
          </div>
        </AppProvider>
      </QueryClientProvider>
    </HeroUIProvider>
  );
}

export default App;
