import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  FileText,
  Shield,
  Brain,
  Zap,
  Database
} from "lucide-react";

export const Dashboard = () => {
  const stats = [
    {
      title: "Relatórios Processados",
      value: "156",
      change: "+12%",
      trend: "up",
      icon: FileText
    },
    {
      title: "Aprovações Pendentes", 
      value: "8",
      change: "-25%",
      trend: "down",
      icon: Clock
    },
    {
      title: "Usuários Ativos",
      value: "42",
      change: "+8%", 
      trend: "up",
      icon: Users
    },
    {
      title: "Compliance Score",
      value: "98.5%",
      change: "+2.1%",
      trend: "up", 
      icon: Shield
    }
  ];

  const workflows = [
    {
      name: "Demonstrações Q3 2024",
      status: "Em Aprovação",
      progress: 85,
      responsible: "Maria Silva",
      deadline: "15/12/2024"
    },
    {
      name: "Notas Explicativas Q3",
      status: "Em Revisão", 
      progress: 60,
      responsible: "João Santos",
      deadline: "18/12/2024"
    },
    {
      name: "Relatório Anual 2024",
      status: "Em Elaboração",
      progress: 25,
      responsible: "Ana Costa",
      deadline: "31/01/2025"
    }
  ];

  const alerts = [
    {
      type: "warning",
      message: "Prazo de aprovação próximo ao vencimento",
      module: "Workflow Digital",
      time: "2h atrás"
    },
    {
      type: "info", 
      message: "Nova integração SAP disponível",
      module: "Integração SAP",
      time: "4h atrás"
    },
    {
      type: "success",
      message: "Blockchain registrou 15 novas transações",
      module: "Blockchain",
      time: "6h atrás"
    }
  ];

  return (
    <div className="flex-1 p-6 bg-gradient-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard Central</h1>
            <p className="text-muted-foreground mt-1">
              Visão consolidada dos processos financeiros
            </p>
          </div>

        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="bg-card shadow-card border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">
                    {stat.title}
                  </CardTitle>
                  <IconComponent className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className={`h-3 w-3 mr-1 ${
                      stat.trend === 'up' ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    {stat.change} vs mês anterior
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Workflows em Andamento */}
          <Card className="bg-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="text-foreground">Workflows em Andamento</CardTitle>
              <CardDescription>Acompanhe o progresso dos relatórios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {workflows.map((workflow, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">{workflow.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {workflow.status}
                    </Badge>
                  </div>
                  <Progress value={workflow.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Responsável: {workflow.responsible}</span>
                    <span>Prazo: {workflow.deadline}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Alertas e Notificações */}
          <Card className="bg-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="text-foreground">Alertas do Sistema</CardTitle>
              <CardDescription>Monitoramento em tempo real</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  {alert.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />}
                  {alert.type === 'info' && <Database className="h-4 w-4 text-blue-500 mt-0.5" />}
                  {alert.type === 'success' && <CheckCircle className="h-4 w-4 text-primary mt-0.5" />}
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{alert.message}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">{alert.module}</span>
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};