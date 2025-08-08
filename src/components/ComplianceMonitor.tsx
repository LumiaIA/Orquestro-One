import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  Filter,
  TrendingUp,
  FileText,
  Users,
  Calendar,
  Brain
} from "lucide-react";

interface ComplianceAlert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  status: 'active' | 'resolved' | 'investigating';
  createdAt: string;
  dueDate: string;
  assignedTo: string;
  aiRiskScore: number;
  recommendations: string[];
}

interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive';
  lastCheck: string;
  compliance: number;
  violations: number;
}

const mockAlerts: ComplianceAlert[] = [
  {
    id: '1',
    title: 'Divergência em Contas a Receber',
    description: 'IA detectou inconsistência de R$ 2.3M entre SAP e demonstrações',
    severity: 'critical',
    category: 'Integridade de Dados',
    status: 'active',
    createdAt: '2024-01-15T10:30:00',
    dueDate: '2024-01-16T18:00:00',
    assignedTo: 'Maria Silva',
    aiRiskScore: 95,
    recommendations: [
      'Verificar lançamentos manuais dos últimos 7 dias',
      'Revisar processo de conciliação automática',
      'Validar regras de conversão de moeda'
    ]
  },
  {
    id: '2',
    title: 'Prazo de Aprovação Excedido',
    description: 'Demonstração DRE pendente há 3 dias sem aprovação',
    severity: 'high',
    category: 'Workflow',
    status: 'investigating',
    createdAt: '2024-01-14T14:20:00',
    dueDate: '2024-01-17T12:00:00',
    assignedTo: 'João Santos',
    aiRiskScore: 78,
    recommendations: [
      'Escalar para supervisor imediato',
      'Verificar disponibilidade do aprovador',
      'Considerar aprovação delegada'
    ]
  },
  {
    id: '3',
    title: 'Padrão Anômalo Detectado',
    description: 'IA identificou padrão incomum em despesas operacionais',
    severity: 'medium',
    category: 'Análise Preditiva',
    status: 'active',
    createdAt: '2024-01-15T09:15:00',
    dueDate: '2024-01-18T17:00:00',
    assignedTo: 'Ana Costa',
    aiRiskScore: 65,
    recommendations: [
      'Analisar variação mensal das despesas',
      'Comparar com período anterior',
      'Verificar novos fornecedores'
    ]
  }
];

const mockRules: ComplianceRule[] = [
  {
    id: '1',
    name: 'Integridade SAP-DFs',
    description: 'Verificação automática de consistência entre SAP e demonstrações',
    category: 'Integridade de Dados',
    status: 'active',
    lastCheck: '2024-01-15T11:00:00',
    compliance: 92,
    violations: 3
  },
  {
    id: '2',
    name: 'Prazos de Aprovação',
    description: 'Monitoramento de SLA para aprovações de demonstrações',
    category: 'Workflow',
    status: 'active',
    lastCheck: '2024-01-15T10:45:00',
    compliance: 87,
    violations: 5
  },
  {
    id: '3',
    name: 'Segregação de Funções',
    description: 'Validação de separação adequada de responsabilidades',
    category: 'Controles Internos',
    status: 'active',
    lastCheck: '2024-01-15T10:30:00',
    compliance: 98,
    violations: 1
  }
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-500 text-white';
    case 'high': return 'bg-orange-500 text-white';
    case 'medium': return 'bg-yellow-500 text-black';
    case 'low': return 'bg-blue-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active': return <AlertTriangle className="h-4 w-4" />;
    case 'resolved': return <CheckCircle className="h-4 w-4" />;
    case 'investigating': return <Clock className="h-4 w-4" />;
    default: return <XCircle className="h-4 w-4" />;
  }
};

const getRiskColor = (score: number) => {
  if (score >= 90) return 'text-red-600';
  if (score >= 70) return 'text-orange-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-green-600';
};

export const ComplianceMonitor = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredAlerts = mockAlerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    const matchesCategory = selectedCategory === 'all' || alert.category === selectedCategory;
    
    return matchesSearch && matchesSeverity && matchesCategory;
  });

  const criticalAlerts = mockAlerts.filter(alert => alert.severity === 'critical').length;
  const activeAlerts = mockAlerts.filter(alert => alert.status === 'active').length;
  const avgCompliance = Math.round(mockRules.reduce((acc, rule) => acc + rule.compliance, 0) / mockRules.length);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Monitoramento de Compliance</h1>
          <p className="text-muted-foreground mt-2">
            Sistema inteligente de monitoramento e alertas automáticos
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alertas Críticos</p>
                <p className="text-2xl font-bold text-red-600">{criticalAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alertas Ativos</p>
                <p className="text-2xl font-bold text-orange-600">{activeAlerts}</p>
              </div>
              <Shield className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliance Médio</p>
                <p className="text-2xl font-bold text-green-600">{avgCompliance}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Regras Ativas</p>
                <p className="text-2xl font-bold text-blue-600">{mockRules.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="alerts">Alertas Ativos</TabsTrigger>
          <TabsTrigger value="rules">Regras de Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar alertas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">Todas as Severidades</option>
                  <option value="critical">Crítico</option>
                  <option value="high">Alto</option>
                  <option value="medium">Médio</option>
                  <option value="low">Baixo</option>
                </select>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">Todas as Categorias</option>
                  <option value="Integridade de Dados">Integridade de Dados</option>
                  <option value="Workflow">Workflow</option>
                  <option value="Análise Preditiva">Análise Preditiva</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Alerts List */}
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className="border-l-4 border-l-red-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(alert.status)}
                        <CardTitle className="text-lg">{alert.title}</CardTitle>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <CardDescription>{alert.description}</CardDescription>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {alert.assignedTo}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Prazo: {new Date(alert.dueDate).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Brain className="h-4 w-4" />
                          Risco IA: <span className={getRiskColor(alert.aiRiskScore)}>{alert.aiRiskScore}%</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">Recomendações da IA:</h4>
                      <ul className="space-y-1">
                        {alert.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="default">
                        Investigar
                      </Button>
                      <Button size="sm" variant="outline">
                        Atribuir
                      </Button>
                      <Button size="sm" variant="outline">
                        Resolver
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <div className="grid gap-4">
            {mockRules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{rule.name}</CardTitle>
                      <CardDescription>{rule.description}</CardDescription>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Categoria: {rule.category}</span>
                        <span>Última verificação: {new Date(rule.lastCheck).toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                    <Badge variant={rule.status === 'active' ? 'default' : 'secondary'}>
                      {rule.status === 'active' ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Nível de Compliance</span>
                        <span className="text-sm font-bold">{rule.compliance}%</span>
                      </div>
                      <Progress value={rule.compliance} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Violações detectadas: {rule.violations}
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Configurar
                        </Button>
                        <Button size="sm" variant="outline">
                          Histórico
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};