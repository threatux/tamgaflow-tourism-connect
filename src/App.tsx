import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import OwnerPage from "@/pages/OwnerPage";
import TouristPage from "@/pages/TouristPage";
import ConciergePage from "@/pages/ConciergePage";
import RestPointDetailPage from "@/pages/RestPointDetailPage";
import PayPage from "@/pages/PayPage";
import DashboardPage from "@/pages/DashboardPage";
import MapPage from "@/pages/MapPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/owner" element={<OwnerPage />} />
            <Route path="/tourist" element={<TouristPage />} />
            <Route path="/concierge" element={<ConciergePage />} />
            <Route path="/point/:id" element={<RestPointDetailPage />} />
            <Route path="/pay" element={<PayPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
