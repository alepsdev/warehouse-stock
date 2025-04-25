
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Box, 
  Boxes, 
  Home, 
  FileText, 
  ClipboardList 
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <div className={cn("bg-sidebar p-4 w-64 h-[calc(100vh-64px)] bg-warehouse-50", className)}>
      <nav className="space-y-2">
        <SidebarLink to="/" icon={<Home size={20} />} text="Painel" />
        <SidebarLink to="/products" icon={<Boxes size={20} />} text="Produtos" />
        <SidebarLink to="/inventory" icon={<Box size={20} />} text="Controle de Estoque" />
        <SidebarLink to="/reports" icon={<FileText size={20} />} text="Relatórios" />
        <SidebarLink to="/history" icon={<ClipboardList size={20} />} text="Histórico de Movimentações" />
      </nav>
    </div>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, text }) => {
  return (
    <Link to={to} className="flex items-center gap-3 p-3 rounded-md text-warehouse-900 hover:bg-warehouse-200 transition-colors">
      {icon}
      <span>{text}</span>
    </Link>
  );
};

export default Sidebar;
