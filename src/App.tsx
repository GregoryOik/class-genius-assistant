
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SubjectProvider } from "./contexts/SubjectContext";
import { AIProvider } from "./contexts/AIContext";

import Layout from "./components/Layout";
import Index from "./pages/Index";
import SubjectsPage from "./pages/SubjectsPage";
import SubjectFormPage from "./pages/SubjectFormPage";
import SubjectDetailPage from "./pages/SubjectDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SubjectProvider>
        <AIProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/subjects" element={<SubjectsPage />} />
                <Route path="/subjects/new" element={<SubjectFormPage />} />
                <Route path="/subjects/:id" element={<SubjectDetailPage />} />
                <Route path="/subjects/:id/edit" element={<SubjectFormPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </AIProvider>
      </SubjectProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
