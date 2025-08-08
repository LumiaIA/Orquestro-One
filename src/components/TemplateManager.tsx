import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Plus, 
  Edit, 
  Copy, 
  Trash2, 
  Eye, 
  Sparkles, 
  CheckCircle,
  AlertTriangle,
  Clock,
  Download,
  Upload
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Template {
  id: string;
  name: string;
  type: 'DRE' | 'Balanço' | 'DFC' | 'DMPL' | 'DVA' | 'Notas';
  description: string;
  status: 'ativo' | 'rascunho' | 'arquivado';
  lastModified: string;
  createdBy: string;
  aiSuggestions: number;
  compliance: 'conforme' | 'pendente' | 'nao_conforme';
  fields: TemplateField[];
}

interface TemplateField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'formula';
  required: boolean;
  aiSuggestion?: string;
  validation?: string;
}

export const TemplateManager = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const { toast } = useToast();
  const { hasPermission, user } = useAuth();

  // Templates simulados
  const mockTemplates: Template[] = [
    {
      id: '1',
      name: 'DRE Padrão Agrícola',
      type: 'DRE',
      description: 'Demonstração do Resultado do Exercício conforme padrões da empresa',
      status: 'ativo',
      lastModified: '2024-01-15 16:30',
      createdBy: 'Maria Silva',
      aiSuggestions: 3,
      compliance: 'conforme',
      fields: [
        { id: '1', name: 'Receita Bruta', type: 'number', required: true, aiSuggestion: 'Considere incluir receitas de commodities agrícolas' },
        { id: '2', name: 'Impostos sobre Vendas', type: 'number', required: true },
        { id: '3', name: 'Receita Líquida', type: 'formula', required: true, validation: 'Receita Bruta - Impostos' }
      ]
    },
    {
      id: '2',
      name: 'Balanço Patrimonial Consolidado',
      type: 'Balanço',
      description: 'Balanço patrimonial com consolidação de subsidiárias',
      status: 'ativo',
      lastModified: '2024-01-14 14:20',
      createdBy: 'João Santos',
      aiSuggestions: 1,
      compliance: 'conforme',
      fields: [
        { id: '1', name: 'Ativo Circulante', type: 'number', required: true },
        { id: '2', name: 'Ativo Não Circulante', type: 'number', required: true },
        { id: '3', name: 'Total do Ativo', type: 'formula', required: true, validation: 'AC + ANC' }
      ]
    },
    {
      id: '3',
      name: 'DFC Método Direto',
      type: 'DFC',
      description: 'Demonstração dos Fluxos de Caixa pelo método direto',
      status: 'rascunho',
      lastModified: '2024-01-13 10:15',
      createdBy: 'Ana Costa',
      aiSuggestions: 5,
      compliance: 'pendente',
      fields: [
        { id: '1', name: 'Recebimentos de Clientes', type: 'number', required: true },
        { id: '2', name: 'Pagamentos a Fornecedores', type: 'number', required: true }
      ]
    }
  ];

  useEffect(() => {
    setTemplates(mockTemplates);
  }, []);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || template.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleCreateTemplate = () => {
    if (!hasPermission('edit')) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para criar templates",
        variant: "destructive"
      });
      return;
    }
    setIsCreating(true);
  };

  const handleDuplicateTemplate = (template: Template) => {
    if (!hasPermission('edit')) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para duplicar templates",
        variant: "destructive"
      });
      return;
    }

    const newTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Cópia)`,
      status: 'rascunho' as const,
      lastModified: new Date().toLocaleString('pt-BR'),
      createdBy: user?.name || 'Usuário'
    };

    setTemplates(prev => [newTemplate, ...prev]);
    toast({
      title: "Template duplicado!",
      description: `Template "${newTemplate.name}" criado com sucesso`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-500';
      case 'rascunho': return 'bg-yellow-500';
      case 'arquivado': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getComplianceColor = (compliance: string) => {
    switch (compliance) {
      case 'conforme': return 'text-green-600';
      case 'pendente': return 'text-yellow-600';
      case 'nao_conforme': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getComplianceIcon = (compliance: string) => {
    switch (compliance) {
      case 'conforme': return <CheckCircle className="h-4 w-4" />;
      case 'pendente': return <Clock className="h-4 w-4" />;
      case 'nao_conforme': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex-1 p-6 bg-gradient-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciador de Templates</h1>
          <p className="text-muted-foreground text-lg mt-1">
            Crie e gerencie templates para demonstrações financeiras
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" className="text-base">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button onClick={handleCreateTemplate} className="bg-gradient-primary text-base">
            <Plus className="h-4 w-4 mr-2" />
            Novo Template
          </Button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-base font-medium">Buscar Templates</Label>
              <Input
                id="search"
                placeholder="Digite o nome ou descrição do template..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 text-base mt-1"
              />
            </div>
            
            <div className="w-full md:w-48">
              <Label className="text-base font-medium">Tipo de Demonstração</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-11 text-base mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="DRE">DRE</SelectItem>
                  <SelectItem value="Balanço">Balanço Patrimonial</SelectItem>
                  <SelectItem value="DFC">DFC</SelectItem>
                  <SelectItem value="DMPL">DMPL</SelectItem>
                  <SelectItem value="DVA">DVA</SelectItem>
                  <SelectItem value="Notas">Notas Explicativas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sugestões de IA */}
      <Alert className="border-primary/20 bg-primary/5">
        <Sparkles className="h-4 w-4 text-primary" />
        <AlertDescription className="text-base">
          <strong>Sugestões da IA:</strong> O sistema analisou seus dados e sugere criar um template específico para "Demonstração de Valor Adicionado Agrícola".
        </AlertDescription>
      </Alert>

      {/* Lista de Templates */}
      <div className="grid gap-4">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <FileText className="h-8 w-8 text-primary mt-1" />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg">{template.name}</h3>
                      <Badge className={getStatusColor(template.status)}>
                        {template.status === 'ativo' ? 'Ativo' : 
                         template.status === 'rascunho' ? 'Rascunho' : 'Arquivado'}
                      </Badge>
                      <Badge variant="outline">{template.type}</Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-3 text-base">
                      {template.description}
                    </p>
                    
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <span>Criado por: {template.createdBy}</span>
                      <span>Modificado: {template.lastModified}</span>
                      <div className="flex items-center space-x-1">
                        <Sparkles className="h-4 w-4" />
                        <span>{template.aiSuggestions} sugestões de IA</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${getComplianceColor(template.compliance)}`}>
                        {getComplianceIcon(template.compliance)}
                        <span>
                          {template.compliance === 'conforme' ? 'Conforme' :
                           template.compliance === 'pendente' ? 'Pendente' : 'Não Conforme'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl">Editar Template: {template.name}</DialogTitle>
                        <DialogDescription className="text-base">
                          Modifique os campos e configurações do template
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label className="text-base font-medium">Nome do Template</Label>
                            <Input defaultValue={template.name} className="h-11 text-base mt-1" />
                          </div>
                          <div>
                            <Label className="text-base font-medium">Tipo</Label>
                            <Select defaultValue={template.type}>
                              <SelectTrigger className="h-11 text-base mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="DRE">DRE</SelectItem>
                                <SelectItem value="Balanço">Balanço Patrimonial</SelectItem>
                                <SelectItem value="DFC">DFC</SelectItem>
                                <SelectItem value="DMPL">DMPL</SelectItem>
                                <SelectItem value="DVA">DVA</SelectItem>
                                <SelectItem value="Notas">Notas Explicativas</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-base font-medium">Descrição</Label>
                          <Textarea 
                            defaultValue={template.description} 
                            className="text-base mt-1"
                            rows={3}
                          />
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-lg mb-3">Campos do Template</h4>
                          <div className="space-y-3">
                            {template.fields.map((field) => (
                              <Card key={field.id} className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-3">
                                      <span className="font-medium">{field.name}</span>
                                      <Badge variant="outline">{field.type}</Badge>
                                      {field.required && <Badge variant="destructive">Obrigatório</Badge>}
                                    </div>
                                    {field.aiSuggestion && (
                                      <div className="flex items-start space-x-2 mt-2 p-2 bg-primary/5 rounded">
                                        <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                                        <span className="text-sm text-primary">{field.aiSuggestion}</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button variant="ghost" size="sm">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                          
                          <Button variant="outline" className="w-full mt-4">
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Campo
                          </Button>
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                          <Button variant="outline">Cancelar</Button>
                          <Button className="bg-gradient-primary">Salvar Alterações</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDuplicateTemplate(template)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum template encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Não foram encontrados templates que correspondam aos seus critérios de busca.
            </p>
            <Button onClick={handleCreateTemplate} className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Template
            </Button>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
};