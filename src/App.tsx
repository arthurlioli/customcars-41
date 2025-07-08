import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MeusBilhetes from "./pages/MeusBilhetes";
import MeusRecibos from "./pages/MeusRecibos";
import Perfil from "./pages/Perfil";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Regulamento from "./pages/Regulamento";
import Ganhadores from "./pages/Ganhadores";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/meus-bilhetes" element={<MeusBilhetes />} />
          <Route path="/meus-recibos" element={<MeusRecibos />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/regulamento" element={<Regulamento />} />
          <Route path="/ganhadores" element={<Ganhadores />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
