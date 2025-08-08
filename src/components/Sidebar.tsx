import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { 
  Database, 
  FileText, 
  Users, 
  Edit3, 
  Search, 
  Shield, 
  BarChart3, 
  Smartphone, 
  Settings,
  Blocks,
  Home,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const modules = [
  {
    id: "sap-integration",
    title: "Integração SAP",
    icon: Database,
    description: "Conecta automaticamente ao SAP com IA",
    status: "active"
  },
  {
    id: "templates",
    title: "Templates",
    icon: FileText,
    description: "Modelagem de demonstrações financeiras",
    status: "active"
  },
  {
    id: "workflow", 
    title: "Workflow Digital",
    icon: Users,
    description: "Controle de permissões e aprovações",
    status: "active"
  },
  {
    id: "editing",
    title: "Edição Estruturada", 
    icon: Edit3,
    description: "Justificativas e anexos vinculados",
    status: "active"
  },
  {
    id: "audit-trail",
    title: "Trilha de Auditoria",
    icon: Search,
    description: "Rastreabilidade completa de ações",
    status: "active"
  },
  {
    id: "compliance",
    title: "Compliance",
    icon: Shield,
    description: "Monitoramento e alertas automáticos",
    status: "active"
  },
  {
    id: "dashboard",
    title: "Dashboard",
    icon: BarChart3,
    description: "Visão consolidada e insights IA",
    status: "active"
  },
  {
    id: "usability",
    title: "Interface",
    icon: Smartphone,
    description: "Experiência responsiva e intuitiva",
    status: "active"
  },
  {
    id: "apis",
    title: "APIs Abertas",
    icon: Settings,
    description: "Escalabilidade e integrações",
    status: "active"
  },
  {
    id: "blockchain",
    title: "Blockchain",
    icon: Blocks,
    description: "Registro imutável para auditoria",
    status: "active"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-primary text-primary-foreground";
    case "pending": return "bg-muted text-muted-foreground";
    case "review": return "bg-accent text-accent-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "active": return "Ativo";
    case "pending": return "Pendente";
    case "review": return "Em Revisão";
    default: return "Inativo";
  }
};

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);

  const navigationItems = [
    { id: "/dashboard", title: "Dashboard", icon: BarChart3 },
    { id: "/sap-integration", title: "Integração SAP", icon: Database },
    { id: "/templates", title: "Templates", icon: FileText },
    { id: "/workflows", title: "Workflows", icon: Users },
    { id: "/structured-editor", title: "Edição Estruturada", icon: Edit3 },
    { id: "/audit-trail", title: "Trilha de Auditoria", icon: Search },
    { id: "/compliance", title: "Compliance", icon: Shield },
    { id: "/ai-insights", title: "Insights IA", icon: Blocks },
    { id: "/api-manager", title: "APIs Abertas", icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Card className={`${isExpanded ? 'w-80' : 'w-16'} h-screen bg-sidebar border-r shadow-subtle rounded-none flex flex-col transition-all duration-300`}>
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-2 z-10 h-8 w-8 p-0"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
      <div className="p-6 flex-1">
        {isExpanded && (
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Orquestro One</h1>
            <p className="text-sm text-muted-foreground">
              Sistema Orquestro One para demonstrações financeiras
            </p>
          </div>
        )}



        {/* Navigation */}
        <div className="space-y-2 mb-8">
          {isExpanded && (
            <h2 className="text-sm font-semibold text-foreground mb-4">
              Navegação
            </h2>
          )}
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.id;
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`${isExpanded ? 'w-full justify-start' : 'w-10 h-10 p-0 justify-center'} p-3 transition-fast ${
                  isActive ? "bg-gradient-primary text-primary-foreground" : "hover:bg-primary-muted"
                }`}
                onClick={() => navigate(item.id)}
                title={!isExpanded ? item.title : undefined}
              >
                <IconComponent className={`h-4 w-4 ${isExpanded ? 'mr-3' : ''} ${
                  isActive ? "text-primary-foreground" : "text-primary"
                }`} />
                {isExpanded && <span className="font-medium text-sm">{item.title}</span>}
              </Button>
            );
          })}
          
          {/* Logout Button */}
          <Button
            variant="ghost"
            className={`${isExpanded ? 'w-full justify-start' : 'w-10 h-10 p-0 justify-center'} p-3 transition-fast hover:bg-destructive hover:text-destructive-foreground mt-4`}
            onClick={handleLogout}
            title={!isExpanded ? "Sair" : undefined}
          >
            <LogOut className={`h-4 w-4 ${isExpanded ? 'mr-3' : ''}`} />
            {isExpanded && <span className="font-medium text-sm">Sair</span>}
          </Button>
        </div>

        <div className="space-y-3">
        </div>
      </div>
    </Card>
  );
};