
import React from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import { useAuth } from "@/context/auth-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { Toaster } from "@/components/ui/sonner";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <Toaster richColors position="top-center" />
      
      <div className="flex flex-1">
        {isAuthenticated && !isMobile && <Sidebar />}
        
        <main className={`flex-1 p-6 ${isAuthenticated && !isMobile ? 'ml-64' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
