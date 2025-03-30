import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { InventoryProvider } from "./contexts/inventoryContext";
import { TagProvider } from "./contexts/TagContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Products from "./pages/Products";
import Orders from "./pages/Sales";
import Tickets from "./pages/Tickets";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Developer from "./pages/Developer"; // Import Developer page
import Contacts from "./pages/Contacts"; // Ensure Contacts page is imported

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SettingsProvider>
              <InventoryProvider>
                <TagProvider>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/sales" element={<Orders />} />
                    <Route path="/tickets" element={<Tickets />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/developer" element={<Developer />} />
                    <Route path="/contacts" element={<Contacts />} /> {/* Add the Contacts route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </TagProvider>
              </InventoryProvider>
            </SettingsProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
