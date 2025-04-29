
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { VoiceAgentProvider } from "./hooks/useVoiceAgent";

// Pages
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Agents from "./pages/Agents";
import CreateAgent from "./pages/CreateAgent";
import EditAgent from "./pages/EditAgent";
import AgentPreviewPage from "./pages/AgentPreviewPage";
import History from "./pages/History";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <VoiceAgentProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Navigate to="/dashboard" />} /> {/* Redirect login to dashboard */}
            <Route path="/dashboard" element={
              <Layout>
                <Index />
              </Layout>
            } />
            <Route path="/agents" element={
              <Layout>
                <Agents />
              </Layout>
            } />
            <Route path="/agents/create" element={
              <Layout>
                <CreateAgent />
              </Layout>
            } />
            <Route path="/agents/edit/:id" element={
              <Layout>
                <EditAgent />
              </Layout>
            } />
            <Route path="/agents/preview/:id" element={
              <Layout>
                <AgentPreviewPage />
              </Layout>
            } />
            <Route path="/history" element={
              <Layout>
                <History />
              </Layout>
            } />
            <Route path="/settings" element={
              <Layout>
                <Settings />
              </Layout>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </VoiceAgentProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
