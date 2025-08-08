import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Shield, 
  Clock, 
  User, 
  FileText, 
  Edit, 
  Eye, 
  Download, 
  Search,
  Filter,
  Calendar as CalendarIcon,
  Hash,
  Lock,
  CheckCircle,
  AlertTriangle,
  Activity,
  Database,
  Zap
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'view' | 'export';
  resource: string;
  resourceType: 'template' | 'workflow' | 'document' | 'user' | 'system';
  description: string;
  ipAddress: string;
  userAgent: string;
  blockchainHash: string;
  riskLevel: 'low' | 'medium' | 'high';
  aiAnalysis?: string;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

interface BlockchainBlock {
  id: string;
  hash: string;
  previousHash: string;
  timestamp: string;
  transactions: number;
  merkleRoot: string;
  nonce: number;
  difficulty: number;
}

export const AuditTrail = () => {
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [blockchainBlocks, setBlockchainBlocks] = useState<BlockchainBlock[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterUser, setFilterUser] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);
  const { toast } = useToast();
  const { hasPermission } = useAuth();

  // Dados simulados de auditoria
  const mockAuditEntries: AuditEntry[] = [
    {
      id: '1',
      timestamp: '2024-01-15 16:45:23',
      user: 'Maria Silva',
      action: 'update',
      resource: 'DRE Q4 2024 - Agrícola',
      resourceType: 'document',
      description: 'Atualização da conta "Receitas de Commodities" de R$ 1.250.000 para R$ 1.275.000',
      ipAddress: '192.168.1.45',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      riskLevel: 'medium',
      aiAnalysis: 'Alteração significativa detectada. Variação de 2% acima da média histórica.',
      changes: [
        {
          field: 'Receitas de Commodities',
          oldValue: 'R$ 1.250.000,00',
          newValue: 'R$ 1.275.000,00'
        }
      ]
    },
    {
      id: '2',
      timestamp: '2024-01-15 14:30:15',
      user: 'João Santos',
      action: 'approve',
      resource: 'Template DRE Padrão',
      resourceType: 'template',
      description: 'Aprovação do template DRE Padrão Agrícola',
      ipAddress: '192.168.1.32',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      blockchainHash: '0x2b3c4d5e6f7890ab1234567890abcdef1234567890',
      riskLevel: 'low'
    },
    {
      id: '3',
      timestamp: '2024-01-15 11:20:45',
      user: 'Ana Costa',
      action: 'create',
      resource: 'Workflow Balanço Patrimonial 2024',
      resourceType: 'workflow',
      description: 'Criação de novo workflow para Balanço Patrimonial 2024',
      ipAddress: '192.168.1.67',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      blockchainHash: '0x3c4d5e6f7890ab1234567890abcdef1234567890ab',
      riskLevel: 'low'
    },
    {
      id: '4',
      timestamp: '2024-01-15 09:15:30',
      user: 'Carlos Oliveira',
      action: 'export',
      resource: 'Relatório de Auditoria Q4 2024',
      resourceType: 'document',
      description: 'Exportação de relatório de auditoria em formato PDF',
      ipAddress: '192.168.1.89',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      blockchainHash: '0x4d5e6f7890ab1234567890abcdef1234567890abcd',
      riskLevel: 'medium',
      aiAnalysis: 'Exportação de dados sensíveis detectada. Usuário possui permissões adequadas.'
    },
    {
      id: '5',
      timestamp: '2024-01-14 17:30:00',
      user: 'Sistema',
      action: 'update',
      resource: 'Integração SAP',
      resourceType: 'system',
      description: 'Sincronização automática de dados do SAP - 5.751 registros processados',
      ipAddress: '10.0.0.1',
      userAgent: 'OrquestroBot/1.0',
      blockchainHash: '0x5e6f7890ab1234567890abcdef1234567890abcdef',
      riskLevel: 'low'
    }
  ];

  // Blocos blockchain simulados
  const mockBlockchainBlocks: BlockchainBlock[] = [
    {
      id: '1',
      hash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      previousHash: '0x0000000000000000000000000000000000000000',
      timestamp: '2024-01-15 16:45:23',
      transactions: 1,
      merkleRoot: '0xa1b2c3d4e5f6789012345678901234567890abcd',
      nonce: 142857,
      difficulty: 4
    },
    {
      id: '2',
      hash: '0x2b3c4d5e6f7890ab1234567890abcdef1234567890',
      previousHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      timestamp: '2024-01-15 14:30:15',
      transactions: 1,
      merkleRoot: '0xb2c3d4e5f6789012345678901234567890abcdef1',
      nonce: 98765,
      difficulty: 4
    },
    {
      id: '3',
      hash: '0x3c4d5e6f7890ab1234567890abcdef1234567890ab',
      previousHash: '0x2b3c4d5e6f7890ab1234567890abcdef1234567890',
      timestamp: '2024-01-15 11:20:45',
      transactions: 2,
      merkleRoot: '0xc3d4e5f6789012345678901234567890abcdef12a',
      nonce: 234567,
      difficulty: 4
    }
  ];

  useEffect(() => {
    setAuditEntries(mockAuditEntries);
    setBlockchainBlocks(mockBlockchainBlocks);
  }, []);

  const filteredEntries = auditEntries.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'all' || entry.action === filterAction;
    const matchesUser = filterUser === 'all' || entry.user === filterUser;
    
    let matchesDate = true;
    if (dateRange.from || dateRange.to) {
      const entryDate = new Date(entry.timestamp);
      if (dateRange.from && entryDate < dateRange.from) matchesDate = false;
      if (dateRange.to && entryDate > dateRange.to) matchesDate = false;
    }
    
    return matchesSearch && matchesAction && matchesUser && matchesDate;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'bg-green-500';
      case 'update': return 'bg-blue-500';
      case 'delete': return 'bg-red-500';
      case 'approve': return 'bg-green-600';
      case 'reject': return 'bg-red-600';
      case 'view': return 'bg-gray-500';
      case 'export': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'create': return 'Criação';
      case 'update': return 'Atualização';
      case 'delete': return 'Exclusão';
      case 'approve': return 'Aprovação';
      case 'reject': return 'Rejeição';
      case 'view': return 'Visualização';
      case 'export': return 'Exportação';
      default: return action;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleExportAudit = () => {
    if (!hasPermission('audit')) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para exportar dados de auditoria",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Exportação iniciada!",
      description: "O relatório de auditoria será gerado em breve"
    });
  };

  return (
    <div className="flex-1 p-6 bg-gradient-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trilha de Auditoria</h1>
          <p className="text-muted-foreground text-lg mt-1">
            Registro completo e imutável de todas as ações do sistema
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" className="text-base">
            <Filter className="h-4 w-4 mr-2" />
            Filtros Avançados
          </Button>
          <Button onClick={handleExportAudit} className="bg-gradient-primary text-base">
            <Download className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Estatísticas de Segurança */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Registros Seguros</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">blockchain protegido</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Ações Hoje</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">+12% vs ontem</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Alertas de Risco</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">requer atenção</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>IA Ativa</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24/7</div>
            <p className="text-xs text-muted-foreground">monitoramento</p>
          </CardContent>
        </Card>
      </div>

      {/* Blockchain Status */}
      <Alert className="border-primary/20 bg-primary/5">
        <Lock className="h-4 w-4 text-primary" />
        <AlertDescription className="text-base">
          <strong>Blockchain Ativo:</strong> Todos os registros são criptograficamente seguros e imutáveis. 
          Último bloco minerado há 2 minutos com hash: <code className="text-xs">0x1a2b...ef12</code>
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="audit" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="audit" className="text-base">Registros de Auditoria</TabsTrigger>
          <TabsTrigger value="blockchain" className="text-base">Blockchain</TabsTrigger>
          <TabsTrigger value="analytics" className="text-base">Análise de Riscos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="audit" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="grid gap-4 md:grid-cols-5">
                <div>
                  <Label htmlFor="search" className="text-sm font-medium">Buscar</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Buscar registros..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-10"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Ação</Label>
                  <Select value={filterAction} onValueChange={setFilterAction}>
                    <SelectTrigger className="h-10 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Ações</SelectItem>
                      <SelectItem value="create">Criação</SelectItem>
                      <SelectItem value="update">Atualização</SelectItem>
                      <SelectItem value="delete">Exclusão</SelectItem>
                      <SelectItem value="approve">Aprovação</SelectItem>
                      <SelectItem value="reject">Rejeição</SelectItem>
                      <SelectItem value="view">Visualização</SelectItem>
                      <SelectItem value="export">Exportação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Usuário</Label>
                  <Select value={filterUser} onValueChange={setFilterUser}>
                    <SelectTrigger className="h-10 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Usuários</SelectItem>
                      <SelectItem value="Maria Silva">Maria Silva</SelectItem>
                      <SelectItem value="João Santos">João Santos</SelectItem>
                      <SelectItem value="Ana Costa">Ana Costa</SelectItem>
                      <SelectItem value="Carlos Oliveira">Carlos Oliveira</SelectItem>
                      <SelectItem value="Sistema">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Data Inicial</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-10 mt-1 justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? format(dateRange.from, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Data Final</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-10 mt-1 justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.to ? format(dateRange.to, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange.to}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Registros */}
          <div className="space-y-3">
            {filteredEntries.map((entry) => (
              <Card key={entry.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex flex-col items-center space-y-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getActionColor(entry.action)}`}>
                          {entry.action === 'create' && <FileText className="h-4 w-4" />}
                          {entry.action === 'update' && <Edit className="h-4 w-4" />}
                          {entry.action === 'delete' && <AlertTriangle className="h-4 w-4" />}
                          {entry.action === 'approve' && <CheckCircle className="h-4 w-4" />}
                          {entry.action === 'reject' && <AlertTriangle className="h-4 w-4" />}
                          {entry.action === 'view' && <Eye className="h-4 w-4" />}
                          {entry.action === 'export' && <Download className="h-4 w-4" />}
                        </div>
                        <div className={`flex items-center space-x-1 ${getRiskColor(entry.riskLevel)}`}>
                          {getRiskIcon(entry.riskLevel)}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge className={getActionColor(entry.action)}>
                            {getActionText(entry.action)}
                          </Badge>
                          <Badge variant="outline">{entry.resourceType}</Badge>
                          <span className="text-sm text-muted-foreground">{entry.timestamp}</span>
                        </div>
                        
                        <h4 className="font-semibold text-base mb-1">{entry.resource}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{entry.description}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{entry.user}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Hash className="h-3 w-3" />
                            <span className="font-mono">{entry.blockchainHash.substring(0, 10)}...</span>
                          </div>
                          <span>IP: {entry.ipAddress}</span>
                        </div>
                        
                        {entry.aiAnalysis && (
                          <Alert className="mt-3 border-primary/20 bg-primary/5">
                            <Zap className="h-4 w-4 text-primary" />
                            <AlertDescription className="text-sm">
                              <strong>Análise da IA:</strong> {entry.aiAnalysis}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-xl">Detalhes do Registro de Auditoria</DialogTitle>
                          <DialogDescription>
                            Informações completas sobre esta ação
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Ação</Label>
                              <p className="text-base font-semibold">{getActionText(entry.action)}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Usuário</Label>
                              <p className="text-base font-semibold">{entry.user}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Data/Hora</Label>
                              <p className="text-base font-semibold">{entry.timestamp}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Nível de Risco</Label>
                              <div className={`flex items-center space-x-2 ${getRiskColor(entry.riskLevel)}`}>
                                {getRiskIcon(entry.riskLevel)}
                                <span className="font-semibold capitalize">{entry.riskLevel}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Recurso</Label>
                            <p className="text-base font-semibold">{entry.resource}</p>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Descrição</Label>
                            <p className="text-base">{entry.description}</p>
                          </div>
                          
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Endereço IP</Label>
                              <p className="text-base font-mono">{entry.ipAddress}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Hash Blockchain</Label>
                              <p className="text-base font-mono text-xs">{entry.blockchainHash}</p>
                            </div>
                          </div>
                          
                          {entry.changes && entry.changes.length > 0 && (
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Alterações Realizadas</Label>
                              <div className="space-y-2 mt-2">
                                {entry.changes.map((change, index) => (
                                  <div key={index} className="bg-muted p-3 rounded">
                                    <p className="font-medium text-sm">{change.field}</p>
                                    <div className="flex items-center space-x-2 text-sm mt-1">
                                      <span className="text-red-600">De: {change.oldValue}</span>
                                      <span>→</span>
                                      <span className="text-green-600">Para: {change.newValue}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">User Agent</Label>
                            <p className="text-xs text-muted-foreground font-mono">{entry.userAgent}</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="blockchain" className="space-y-4">
          <div className="space-y-4">
            {blockchainBlocks.map((block) => (
              <Card key={block.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Database className="h-8 w-8 text-primary mt-1" />
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-semibold text-lg">Bloco #{block.id}</h3>
                          <Badge className="bg-green-500">Confirmado</Badge>
                        </div>
                        
                        <div className="grid gap-3 md:grid-cols-2">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Hash do Bloco</Label>
                            <p className="text-sm font-mono">{block.hash}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Hash Anterior</Label>
                            <p className="text-sm font-mono">{block.previousHash}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Timestamp</Label>
                            <p className="text-sm">{block.timestamp}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Transações</Label>
                            <p className="text-sm font-semibold">{block.transactions}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Merkle Root</Label>
                            <p className="text-sm font-mono">{block.merkleRoot}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Nonce</Label>
                            <p className="text-sm font-semibold">{block.nonce.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Dificuldade</div>
                      <div className="text-2xl font-bold">{block.difficulty}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span>Alertas de Alto Risco</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                    <span className="text-sm">Alterações fora do horário comercial</span>
                    <Badge variant="destructive">0</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                    <span className="text-sm">Múltiplas tentativas de acesso</span>
                    <Badge className="bg-yellow-500">2</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                    <span className="text-sm">Exportações de dados sensíveis</span>
                    <Badge className="bg-orange-500">1</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <span>Padrões de Atividade</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Horário de pico</span>
                    <span className="font-semibold">14h - 16h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Usuário mais ativo</span>
                    <span className="font-semibold">Maria Silva</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Ação mais comum</span>
                    <span className="font-semibold">Atualização</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Taxa de aprovação</span>
                    <span className="font-semibold text-green-600">94.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {filteredEntries.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum registro encontrado</h3>
            <p className="text-muted-foreground">
              Não foram encontrados registros que correspondam aos filtros aplicados.
            </p>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
};