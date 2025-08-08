import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  FileText,
  Users,
  DollarSign,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface SAPData {
  id: string;
  module: string;
  records: number;
  lastSync: string;
  status: 'synced' | 'pending' | 'error';
  aiValidation: 'passed' | 'warning' | 'failed';
}

export const SAPIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [sapData, setSapData] = useState<SAPData[]>([]);
  const { toast } = useToast();
  const { hasPermission } = useAuth();

  // Dados simulados do SAP
  const mockSAPData: SAPData[] = [
    {
      id: '1',
      module: 'Contas a Pagar',
      records: 1247,
      lastSync: '2024-01-15 14:30',
      status: 'synced',
      aiValidation: 'passed'
    },
    {
      id: '2',
      module: 'Contas a Receber',
      records: 892,
      lastSync: '2024-01-15 14:25',
      status: 'synced',
      aiValidation: 'warning'
    },
    {
      id: '3',
      module: 'Razão Geral',
      records: 3456,
      lastSync: '2024-01-15 14:20',
      status: 'pending',
      aiValidation: 'passed'
    },
    {
      id: '4',
      module: 'Centros de Custo',
      records: 156,
      lastSync: '2024-01-15 14:15',
      status: 'synced',
      aiValidation: 'passed'
    }
  ];

  useEffect(() => {
    // Simula conexão inicial
    const timer = setTimeout(() => {
      setIsConnected(true);
      setSapData(mockSAPData);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSync = async () => {
    if (!hasPermission('edit')) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para sincronizar dados",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setSyncProgress(0);

    // Simula processo de sincronização
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          toast({
            title: "Sincronização concluída!",
            description: "Dados do SAP atualizados com sucesso"
          });
          // Atualiza dados após sincronização
          setSapData(prev => prev.map(item => ({
            ...item,
            status: 'synced' as const,
            lastSync: new Date().toLocaleString('pt-BR')
          })));
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'synced': return 'Sincronizado';
      case 'pending': return 'Pendente';
      case 'error': return 'Erro';
      default: return 'Desconhecido';
    }
  };

  const getAIValidationColor = (validation: string) => {
    switch (validation) {
      case 'passed': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="flex-1 p-6 bg-gradient-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
      {/* Status da Conexão */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Database className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-xl">Integração SAP</CardTitle>
                <CardDescription className="text-base">
                  Conexão e sincronização de dados financeiros
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm font-medium">
                {isConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              Última sincronização: {new Date().toLocaleString('pt-BR')}
            </div>
            <Button 
              onClick={handleSync} 
              disabled={isLoading || !isConnected}
              className="bg-gradient-primary"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Sincronizando...' : 'Sincronizar Agora'}
            </Button>
          </div>
          
          {isLoading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso da sincronização</span>
                <span>{syncProgress}%</span>
              </div>
              <Progress value={syncProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dados dos Módulos */}
      <Tabs defaultValue="modules" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="modules" className="text-base">Módulos SAP</TabsTrigger>
          <TabsTrigger value="validation" className="text-base">Validação IA</TabsTrigger>
          <TabsTrigger value="statistics" className="text-base">Estatísticas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="modules" className="space-y-4">
          <div className="grid gap-4">
            {sapData.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="font-semibold text-lg">{item.module}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.records.toLocaleString()} registros
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <Badge className={getStatusColor(item.status)}>
                          {getStatusText(item.status)}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.lastSync}
                        </p>
                      </div>
                      
                      <div className={`flex items-center space-x-1 ${getAIValidationColor(item.aiValidation)}`}>
                        {item.aiValidation === 'passed' && <CheckCircle className="h-4 w-4" />}
                        {item.aiValidation === 'warning' && <AlertTriangle className="h-4 w-4" />}
                        {item.aiValidation === 'failed' && <AlertTriangle className="h-4 w-4" />}
                        <span className="text-sm font-medium">
                          {item.aiValidation === 'passed' && 'Validado'}
                          {item.aiValidation === 'warning' && 'Atenção'}
                          {item.aiValidation === 'failed' && 'Falhou'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="validation" className="space-y-4">
          <Alert>
            <Activity className="h-4 w-4" />
            <AlertDescription className="text-base">
              <strong>Validação por IA:</strong> O sistema utiliza inteligência artificial para 
              verificar a integridade e consistência dos dados importados do SAP, 
              identificando possíveis inconsistências automaticamente.
            </AlertDescription>
          </Alert>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Validações Aprovadas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">3</div>
                <p className="text-sm text-muted-foreground">módulos validados</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span>Requer Atenção</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">1</div>
                <p className="text-sm text-muted-foreground">módulo com alertas</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="statistics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Total de Registros</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5.751</div>
                <p className="text-xs text-muted-foreground">+12% vs mês anterior</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Tempo de Sync</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.3s</div>
                <p className="text-xs text-muted-foreground">média por módulo</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Taxa de Sucesso</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.8%</div>
                <p className="text-xs text-muted-foreground">últimos 30 dias</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span>Validação IA</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">95.2%</div>
                <p className="text-xs text-muted-foreground">aprovação automática</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};