import React, { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { isLocalEnvironment } from "./utils/environmentCheck";
import LoadingIndicator from "./components/LoadingIndicator";
import { useTranslation } from 'react-i18next';
import './i18n';

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

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button onClick={() => changeLanguage('en')} className="mr-2 px-2 py-1 bg-blue-500 text-white rounded">EN</button>
      <button onClick={() => changeLanguage('ja')} className="px-2 py-1 bg-red-500 text-white rounded">JP</button>
    </div>
  );
};

const App = () => {
  const { t } = useTranslation();

  if (!isLocalEnvironment()) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <h1 className="text-2xl font-bold">{t('localOnly')}</h1>
      </div>
    );
  }

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <LanguageSwitcher />
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