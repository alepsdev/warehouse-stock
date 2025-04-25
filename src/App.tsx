
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/auth-context";
import MainLayout from "@/components/layout/main-layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import { useAuth } from "@/context/auth-context";

const queryClient = new QueryClient();

// Private route component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <MainLayout>{children}</MainLayout>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ShadcnToaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/products" 
              element={
                <PrivateRoute>
                  <Products />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/inventory" 
              element={
                <PrivateRoute>
                  <Inventory />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <PrivateRoute>
                  <Reports />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/history" 
              element={
                <PrivateRoute>
                  <History />
                </PrivateRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
