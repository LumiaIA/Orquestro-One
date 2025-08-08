import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Plus, 
  Activity, 
  Shield, 
  Zap, 
  Globe, 
  Database, 
  Code, 
  Monitor,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3,
  Key,
  Link,
  Server
} from "lucide-react";

interface APIEndpoint {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: 'active' | 'inactive' | 'maintenance';
  description: string;
  category: string;
  version: string;
  lastUsed: string;
  requestsToday: number;
  responseTime: number;
  successRate: number;
  authentication: 'none' | 'api-key' | 'oauth' | 'jwt';
}

interface Integration {
  id: string;
  name: string;
  type: 'inbound' | 'outbound';
  system: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  dataVolume: string;
  frequency: string;
  healthScore: number;
}

interface Microservice {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error';
  version: string;
  instances: number;
  cpuUsage: number;
  memoryUsage: number;
  uptime: string;
  lastDeployment: string;
}

export const APIManager = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("apis");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data para demonstração
  const apiEndpoints: APIEndpoint[] = [
    {
      id: "1",
      name: "Financial Reports API",
      url: "/api/v1/reports",
      method: "GET",
      status: "active",
      description: "Endpoint para consulta de relatórios financeiros",
      category: "Reports",
      version: "v1.2",
      lastUsed: "2024-01-15 16:30",
      requestsToday: 1247,
      responseTime: 145,
      successRate: 99.8,
      authentication: "jwt"
    },
    {
      id: "2",
      name: "SAP Data Sync API",
      url: "/api/v1/sap/sync",
      method: "POST",
      status: "active",
      description: "Sincronização de dados com sistema SAP",
      category: "Integration",
      version: "v2.0",
      lastUsed: "2024-01-15 15:45",
      requestsToday: 324,
      responseTime: 2340,
      successRate: 97.5,
      authentication: "api-key"
    },
    {
      id: "3",
      name: "Audit Trail API",
      url: "/api/v1/audit",
      method: "GET",
      status: "maintenance",
      description: "Consulta de trilhas de auditoria",
      category: "Audit",
      version: "v1.0",
      lastUsed: "2024-01-15 12:20",
      requestsToday: 89,
      responseTime: 89,
      successRate: 100,
      authentication: "oauth"
    }
  ];

  const integrations: Integration[] = [
    {
      id: "1",
      name: "SAP ERP Integration",
      type: "inbound",
      system: "SAP S/4HANA",
      status: "connected",
      lastSync: "2024-01-15 16:45",
      dataVolume: "2.3 GB",
      frequency: "A cada 15 min",
      healthScore: 98
    },
    {
      id: "2",
      name: "External Auditor Portal",
      type: "outbound",
      system: "PwC Audit Platform",
      status: "connected",
      lastSync: "2024-01-15 14:30",
      dataVolume: "450 MB",
      frequency: "Diário às 18h",
      healthScore: 95
    },
    {
      id: "3",
      name: "Regulatory Reporting",
      type: "outbound",
      system: "CVM Portal",
      status: "error",
      lastSync: "2024-01-14 18:00",
      dataVolume: "125 MB",
      frequency: "Mensal",
      healthScore: 45
    }
  ];

  const microservices: Microservice[] = [
    {
      id: "1",
      name: "Report Generator Service",
      status: "running",
      version: "v2.1.3",
      instances: 3,
      cpuUsage: 45,
      memoryUsage: 67,
      uptime: "15 dias",
      lastDeployment: "2024-01-01 09:00"
    },
    {
      id: "2",
      name: "Data Validation Service",
      status: "running",
      version: "v1.8.2",
      instances: 2,
      cpuUsage: 23,
      memoryUsage: 34,
      uptime: "8 dias",
      lastDeployment: "2024-01-07 14:30"
    },
    {
      id: "3",
      name: "Notification Service",
      status: "error",
      version: "v1.5.1",
      instances: 1,
      cpuUsage: 0,
      memoryUsage: 0,
      uptime: "0 min",
      lastDeployment: "2024-01-10 11:15"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'running':
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'inactive':
      case 'stopped':
      case 'disconnected':
        return 'bg-gray-100 text-gray-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-800';
      case 'POST': return 'bg-green-100 text-green-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredAPIs = apiEndpoints.filter(api => {
    const matchesSearch = api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         api.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || api.category === filterCategory;
    const matchesStatus = filterStatus === "all" || api.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="flex-1 p-6 bg-gradient-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de APIs</h1>
          <p className="text-muted-foreground text-lg mt-1">
            Gerencie APIs, integrações e microsserviços do sistema
          </p>
        </div>

      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">APIs Ativas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">98.5%</p>
                <p className="text-sm text-muted-foreground">Disponibilidade</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">156ms</p>
                <p className="text-sm text-muted-foreground">Tempo Resposta</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">12.4K</p>
                <p className="text-sm text-muted-foreground">Requests/dia</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo Principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="apis" className="text-base py-3">
            <Globe className="h-4 w-4 mr-2" />
            APIs
          </TabsTrigger>
          <TabsTrigger value="integrations" className="text-base py-3">
            <Link className="h-4 w-4 mr-2" />
            Integrações
          </TabsTrigger>
          <TabsTrigger value="microservices" className="text-base py-3">
            <Server className="h-4 w-4 mr-2" />
            Microsserviços
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="text-base py-3">
            <Monitor className="h-4 w-4 mr-2" />
            Monitoramento
          </TabsTrigger>
        </TabsList>

        <TabsContent value="apis" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-base font-medium">Buscar API</Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Nome ou URL da API..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12 text-base"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-base font-medium">Categoria</Label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="h-12 text-base mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Categorias</SelectItem>
                      <SelectItem value="Reports">Relatórios</SelectItem>
                      <SelectItem value="Integration">Integração</SelectItem>
                      <SelectItem value="Audit">Auditoria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-base font-medium">Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="h-12 text-base mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                      <SelectItem value="maintenance">Manutenção</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de APIs */}
          <div className="grid gap-4">
            {filteredAPIs.map((api) => (
              <Card key={api.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Code className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{api.name}</h3>
                        <p className="text-muted-foreground font-mono text-sm">{api.url}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getMethodColor(api.method)}>{api.method}</Badge>
                          <Badge className={getStatusColor(api.status)}>
                            {api.status === 'active' ? 'Ativo' : 
                             api.status === 'inactive' ? 'Inativo' : 'Manutenção'}
                          </Badge>
                          <Badge variant="outline">{api.version}</Badge>
                          <Badge variant="secondary">{api.category}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium">{api.requestsToday}</p>
                          <p className="text-muted-foreground">Requests hoje</p>
                        </div>
                        <div>
                          <p className="font-medium">{api.responseTime}ms</p>
                          <p className="text-muted-foreground">Tempo resp.</p>
                        </div>
                        <div>
                          <p className="font-medium text-green-600">{api.successRate}%</p>
                          <p className="text-muted-foreground">Taxa sucesso</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-1" />
                          Configurar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Activity className="h-4 w-4 mr-1" />
                          Logs
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">{api.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Key className="h-4 w-4" />
                        <span>Auth: {api.authentication.toUpperCase()}</span>
                        <Clock className="h-4 w-4 ml-4" />
                        <span>Último uso: {api.lastUsed}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Database className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{integration.name}</h3>
                        <p className="text-muted-foreground">{integration.system}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={integration.type === 'inbound' ? 'default' : 'secondary'}>
                            {integration.type === 'inbound' ? 'Entrada' : 'Saída'}
                          </Badge>
                          <Badge className={getStatusColor(integration.status)}>
                            {integration.status === 'connected' ? 'Conectado' : 
                             integration.status === 'disconnected' ? 'Desconectado' : 'Erro'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{integration.healthScore}</span>
                        <div>
                          <p className={`font-medium ${getHealthScoreColor(integration.healthScore)}`}>Health Score</p>
                          <Progress value={integration.healthScore} className="w-20 h-2" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">{integration.dataVolume}</p>
                          <p className="text-muted-foreground">Volume dados</p>
                        </div>
                        <div>
                          <p className="font-medium">{integration.frequency}</p>
                          <p className="text-muted-foreground">Frequência</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-1" />
                          Configurar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Activity className="h-4 w-4 mr-1" />
                          Testar
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Última sincronização: {integration.lastSync}</span>
                      <div className="flex items-center gap-1">
                        {integration.status === 'connected' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <span>Status da conexão</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="microservices" className="space-y-6">
          <div className="grid gap-4">
            {microservices.map((service) => (
              <Card key={service.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Server className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{service.name}</h3>
                        <p className="text-muted-foreground">Versão {service.version}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getStatusColor(service.status)}>
                            {service.status === 'running' ? 'Executando' : 
                             service.status === 'stopped' ? 'Parado' : 'Erro'}
                          </Badge>
                          <Badge variant="outline">{service.instances} instâncias</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">CPU</span>
                            <span className="text-sm">{service.cpuUsage}%</span>
                          </div>
                          <Progress value={service.cpuUsage} className="w-20 h-2" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">RAM</span>
                            <span className="text-sm">{service.memoryUsage}%</span>
                          </div>
                          <Progress value={service.memoryUsage} className="w-20 h-2" />
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-1" />
                          Configurar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Activity className="h-4 w-4 mr-1" />
                          Logs
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <span>Uptime: {service.uptime}</span>
                      <span>Último deploy: {service.lastDeployment}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Monitoramento em Tempo Real
                </CardTitle>
                <CardDescription className="text-base">
                  Acompanhe a performance e saúde de todas as APIs e integrações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Alertas Ativos</h4>
                    <div className="space-y-3">
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-base">
                          <strong>API de Relatórios:</strong> Tempo de resposta acima do normal (2.3s)
                        </AlertDescription>
                      </Alert>
                      
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-base">
                          <strong>Integração CVM:</strong> Falha na última sincronização
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Métricas de Performance</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Disponibilidade Geral</span>
                          <span className="text-sm">98.5%</span>
                        </div>
                        <Progress value={98.5} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Taxa de Sucesso</span>
                          <span className="text-sm">97.8%</span>
                        </div>
                        <Progress value={97.8} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Uso de Recursos</span>
                          <span className="text-sm">67%</span>
                        </div>
                        <Progress value={67} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Configurações de Monitoramento</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base">Alertas por Email</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-base">Monitoramento 24/7</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-base">Logs Detalhados</Label>
                        <Switch />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-base font-medium">Limite de Tempo de Resposta</Label>
                        <Input className="mt-2 h-12 text-base" defaultValue="2000ms" />
                      </div>
                      <div>
                        <Label className="text-base font-medium">Intervalo de Verificação</Label>
                        <Select defaultValue="5min">
                          <SelectTrigger className="h-12 text-base mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1min">1 minuto</SelectItem>
                            <SelectItem value="5min">5 minutos</SelectItem>
                            <SelectItem value="15min">15 minutos</SelectItem>
                            <SelectItem value="30min">30 minutos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};