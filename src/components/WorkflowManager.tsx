import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  User, 
  MessageSquare, 
  Eye,
  FileText,
  ArrowRight,
  Calendar,
  Users,
  Activity,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  assignee: string;
  assigneeAvatar?: string;
  dueDate: string;
  completedAt?: string;
  comments: Comment[];
  aiInsights?: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  type: 'comment' | 'approval' | 'rejection';
}

interface Workflow {
  id: string;
  name: string;
  type: 'DRE' | 'Balanço' | 'DFC' | 'DMPL';
  status: 'draft' | 'in_progress' | 'review' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  startDate: string;
  dueDate: string;
  createdBy: string;
  steps: WorkflowStep[];
  aiMonitoring: boolean;
}

export const WorkflowManager = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { toast } = useToast();
  const { hasPermission, user } = useAuth();

  // Workflows simulados
  const mockWorkflows: Workflow[] = [
    {
      id: '1',
      name: 'DRE Q4 2024 - Agrícola',
      type: 'DRE',
      status: 'in_progress',
      priority: 'high',
      progress: 65,
      startDate: '2024-01-10',
      dueDate: '2024-01-25',
      createdBy: 'Maria Silva',
      aiMonitoring: true,
      steps: [
        {
          id: '1',
          name: 'Coleta de Dados SAP',
          description: 'Importar dados financeiros do SAP',
          status: 'completed',
          assignee: 'João Santos',
          assigneeAvatar: '/avatars/joao.jpg',
          dueDate: '2024-01-12',
          completedAt: '2024-01-11 14:30',
          comments: [
            {
              id: '1',
              author: 'João Santos',
              content: 'Dados importados com sucesso. Identificadas 3 inconsistências menores.',
              timestamp: '2024-01-11 14:30',
              type: 'comment'
            }
          ]
        },
        {
          id: '2',
          name: 'Validação e Ajustes',
          description: 'Revisar e ajustar dados importados',
          status: 'in_progress',
          assignee: 'Ana Costa',
          assigneeAvatar: '/avatars/ana.jpg',
          dueDate: '2024-01-15',
          comments: [],
          aiInsights: 'IA detectou possível inconsistência na conta "Receitas de Commodities"'
        },
        {
          id: '3',
          name: 'Revisão Gerencial',
          description: 'Aprovação pelos gestores',
          status: 'pending',
          assignee: 'Carlos Oliveira',
          assigneeAvatar: '/avatars/carlos.jpg',
          dueDate: '2024-01-20',
          comments: []
        },
        {
          id: '4',
          name: 'Aprovação Final',
          description: 'Aprovação da diretoria',
          status: 'pending',
          assignee: 'Maria Silva',
          assigneeAvatar: '/avatars/maria.jpg',
          dueDate: '2024-01-25',
          comments: []
        }
      ]
    },
    {
      id: '2',
      name: 'Balanço Patrimonial 2024',
      type: 'Balanço',
      status: 'review',
      priority: 'medium',
      progress: 85,
      startDate: '2024-01-05',
      dueDate: '2024-01-30',
      createdBy: 'João Santos',
      aiMonitoring: true,
      steps: [
        {
          id: '1',
          name: 'Preparação de Dados',
          description: 'Consolidação de dados das subsidiárias',
          status: 'completed',
          assignee: 'Ana Costa',
          dueDate: '2024-01-10',
          completedAt: '2024-01-09 16:45',
          comments: []
        },
        {
          id: '2',
          name: 'Auditoria Interna',
          description: 'Revisão pelos auditores internos',
          status: 'completed',
          assignee: 'Carlos Oliveira',
          dueDate: '2024-01-18',
          completedAt: '2024-01-17 11:20',
          comments: []
        },
        {
          id: '3',
          name: 'Revisão Final',
          description: 'Última revisão antes da aprovação',
          status: 'in_progress',
          assignee: 'Maria Silva',
          dueDate: '2024-01-25',
          comments: []
        }
      ]
    }
  ];

  useEffect(() => {
    setWorkflows(mockWorkflows);
  }, []);

  const filteredWorkflows = workflows.filter(workflow => {
    if (filterStatus === 'all') return true;
    return workflow.status === filterStatus;
  });

  const handleStepAction = (workflowId: string, stepId: string, action: 'approve' | 'reject' | 'comment') => {
    if (!hasPermission('approve') && action !== 'comment') {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para esta ação",
        variant: "destructive"
      });
      return;
    }

    // Simula ação no workflow
    toast({
      title: "Ação realizada!",
      description: `${action === 'approve' ? 'Aprovado' : action === 'reject' ? 'Rejeitado' : 'Comentário adicionado'} com sucesso`
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      case 'blocked': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Play className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'blocked': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex-1 p-6 bg-gradient-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workflows Digitais</h1>
          <p className="text-muted-foreground text-lg mt-1">
            Acompanhe o progresso das demonstrações financeiras
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" className="text-base">
            <Calendar className="h-4 w-4 mr-2" />
            Cronograma
          </Button>
          <Button className="bg-gradient-primary text-base">
            <Play className="h-4 w-4 mr-2" />
            Novo Workflow
          </Button>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Em Andamento</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">workflows ativos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Pendentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">aguardando aprovação</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Concluídos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">este mês</p>
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
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">dos workflows</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-2">
            {['all', 'draft', 'in_progress', 'review', 'approved'].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'default' : 'outline'}
                onClick={() => setFilterStatus(status)}
                className="text-base"
              >
                {status === 'all' ? 'Todos' :
                 status === 'draft' ? 'Rascunho' :
                 status === 'in_progress' ? 'Em Andamento' :
                 status === 'review' ? 'Em Revisão' :
                 status === 'approved' ? 'Aprovados' : status}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Workflows */}
      <div className="grid gap-4">
        {filteredWorkflows.map((workflow) => (
          <Card key={workflow.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <FileText className="h-8 w-8 text-primary mt-1" />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg">{workflow.name}</h3>
                      <Badge className={getPriorityColor(workflow.priority)}>
                        {workflow.priority === 'urgent' ? 'Urgente' :
                         workflow.priority === 'high' ? 'Alta' :
                         workflow.priority === 'medium' ? 'Média' : 'Baixa'}
                      </Badge>
                      <Badge variant="outline">{workflow.type}</Badge>
                      {workflow.aiMonitoring && (
                        <Badge variant="outline" className="text-primary border-primary">
                          <Zap className="h-3 w-3 mr-1" />
                          IA Ativa
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-3">
                      <span>Criado por: {workflow.createdBy}</span>
                      <span>Início: {new Date(workflow.startDate).toLocaleDateString('pt-BR')}</span>
                      <span>Prazo: {new Date(workflow.dueDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progresso do Workflow</span>
                        <span>{workflow.progress}%</span>
                      </div>
                      <Progress value={workflow.progress} className="h-2" />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-base">
                        <Eye className="h-4 w-4 mr-2" />
                        Detalhes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl">{workflow.name}</DialogTitle>
                        <DialogDescription className="text-base">
                          Acompanhe o progresso detalhado do workflow
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        {/* Informações Gerais */}
                        <div className="grid gap-4 md:grid-cols-3">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                            <p className="text-base font-semibold">
                              {workflow.status === 'in_progress' ? 'Em Andamento' :
                               workflow.status === 'review' ? 'Em Revisão' :
                               workflow.status === 'approved' ? 'Aprovado' : workflow.status}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Progresso</Label>
                            <p className="text-base font-semibold">{workflow.progress}%</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Prazo</Label>
                            <p className="text-base font-semibold">
                              {new Date(workflow.dueDate).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        
                        {/* Etapas do Workflow */}
                        <div>
                          <h4 className="font-semibold text-lg mb-4">Etapas do Workflow</h4>
                          <div className="space-y-4">
                            {workflow.steps.map((step, index) => (
                              <div key={step.id} className="flex items-start space-x-4">
                                <div className="flex flex-col items-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(step.status)}`}>
                                    {getStatusIcon(step.status)}
                                  </div>
                                  {index < workflow.steps.length - 1 && (
                                    <div className="w-px h-12 bg-border mt-2" />
                                  )}
                                </div>
                                
                                <Card className="flex-1">
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                      <div>
                                        <h5 className="font-semibold">{step.name}</h5>
                                        <p className="text-sm text-muted-foreground">{step.description}</p>
                                      </div>
                                      <Badge className={getStatusColor(step.status)}>
                                        {step.status === 'completed' ? 'Concluído' :
                                         step.status === 'in_progress' ? 'Em Andamento' :
                                         step.status === 'pending' ? 'Pendente' : 'Bloqueado'}
                                      </Badge>
                                    </div>
                                    
                                    <div className="flex items-center space-x-4 mb-3">
                                      <div className="flex items-center space-x-2">
                                        <Avatar className="h-6 w-6">
                                          <AvatarImage src={step.assigneeAvatar} />
                                          <AvatarFallback className="text-xs">
                                            {step.assignee.split(' ').map(n => n[0]).join('')}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">{step.assignee}</span>
                                      </div>
                                      <span className="text-sm text-muted-foreground">
                                        Prazo: {new Date(step.dueDate).toLocaleDateString('pt-BR')}
                                      </span>
                                      {step.completedAt && (
                                        <span className="text-sm text-green-600">
                                          Concluído: {step.completedAt}
                                        </span>
                                      )}
                                    </div>
                                    
                                    {step.aiInsights && (
                                      <Alert className="mb-3 border-primary/20 bg-primary/5">
                                        <Zap className="h-4 w-4 text-primary" />
                                        <AlertDescription className="text-sm">
                                          <strong>Insight da IA:</strong> {step.aiInsights}
                                        </AlertDescription>
                                      </Alert>
                                    )}
                                    
                                    {step.comments.length > 0 && (
                                      <div className="space-y-2">
                                        <h6 className="text-sm font-medium">Comentários:</h6>
                                        {step.comments.map((comment) => (
                                          <div key={comment.id} className="bg-muted p-3 rounded text-sm">
                                            <div className="flex justify-between items-start mb-1">
                                              <span className="font-medium">{comment.author}</span>
                                              <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                                            </div>
                                            <p>{comment.content}</p>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    
                                    {step.status === 'in_progress' && hasPermission('approve') && (
                                      <div className="flex space-x-2 mt-3">
                                        <Button 
                                          size="sm" 
                                          onClick={() => handleStepAction(workflow.id, step.id, 'approve')}
                                          className="bg-green-600 hover:bg-green-700"
                                        >
                                          <CheckCircle className="h-4 w-4 mr-1" />
                                          Aprovar
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          variant="destructive"
                                          onClick={() => handleStepAction(workflow.id, step.id, 'reject')}
                                        >
                                          <AlertTriangle className="h-4 w-4 mr-1" />
                                          Rejeitar
                                        </Button>
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Button size="sm" variant="outline">
                                              <MessageSquare className="h-4 w-4 mr-1" />
                                              Comentar
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>Adicionar Comentário</DialogTitle>
                                              <DialogDescription>
                                                Adicione um comentário sobre esta etapa
                                              </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                              <Textarea 
                                                placeholder="Digite seu comentário..."
                                                className="text-base"
                                                rows={4}
                                              />
                                              <div className="flex justify-end space-x-2">
                                                <Button variant="outline">Cancelar</Button>
                                                <Button 
                                                  onClick={() => handleStepAction(workflow.id, step.id, 'comment')}
                                                >
                                                  Adicionar Comentário
                                                </Button>
                                              </div>
                                            </div>
                                          </DialogContent>
                                        </Dialog>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              {/* Próxima Etapa */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium">Próxima etapa:</span>
                    {workflow.steps.find(step => step.status === 'in_progress' || step.status === 'pending') && (
                      <>
                        <span className="text-sm">
                          {workflow.steps.find(step => step.status === 'in_progress' || step.status === 'pending')?.name}
                        </span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {workflow.steps.find(step => step.status === 'in_progress' || step.status === 'pending')?.assignee.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">
                            {workflow.steps.find(step => step.status === 'in_progress' || step.status === 'pending')?.assignee}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{workflow.steps.length} etapas</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWorkflows.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum workflow encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Não há workflows que correspondam ao filtro selecionado.
            </p>
            <Button className="bg-gradient-primary">
              <Play className="h-4 w-4 mr-2" />
              Criar Novo Workflow
            </Button>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
};