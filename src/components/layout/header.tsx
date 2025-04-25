
import React from "react";
import { Button } from "@/components/ui/button";
import { Warehouse } from "lucide-react";
import { useAuth } from "@/context/auth-context";

const Header: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="bg-warehouse-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Warehouse size={32} />
          <h1 className="text-2xl font-bold">Almoxarifado</h1>
        </div>
        
        {isAuthenticated && (
          <div className="flex items-center gap-4">
            <span className="text-sm hidden md:block">
              Bem-vindo, {user?.username}
            </span>
            <Button variant="secondary" size="sm" onClick={logout}>
              Sair
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
