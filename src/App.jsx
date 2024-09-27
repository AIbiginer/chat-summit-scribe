import React, { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { isLocalEnvironment } from "./utils/environmentCheck";
import LoadingIndicator from "./components/LoadingIndicator";

// Dynamically import larger components
const LandingPage = lazy(() => import("./pages/LandingPage"));
const QuestionAnalyzer = lazy(() => import("./components/QuestionAnalyzer"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      cacheTime: 300000,
    },
  },
});

const App = () => {
  if (!isLocalEnvironment()) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-2xl font-bold">このアプリケーションはローカル環境でのみ利用可能です。</h1>
      </div>
    );
  }

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Suspense fallback={<LoadingIndicator />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/analyzer" element={<QuestionAnalyzer />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;