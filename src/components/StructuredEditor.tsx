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
import { useToast } from "@/hooks/use-toast";
import { 
  Edit3, 
  Save, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Paperclip, 
  Brain, 
  History,
  Search,
  Filter,
  Upload
} from "lucide-react";

interface FieldEdit {
  id: string;
  fieldName: string;
  reportType: string;
  oldValue: string;
  newValue: string;
  justification: string;
  attachments: string[];
  status: 'pending' | 'approved' | 'rejected';
  aiSuggestion?: string;
  aiRisk: 'low' | 'medium' | 'high';
  timestamp: string;
  user: string;
}

interface ReportField {
  id: string;
  name: string;
  type: 'number' | 'text' | 'formula' | 'percentage';
  currentValue: string;
  required: boolean;
  category: string;
  validation?: string;
}

export const StructuredEditor = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("editor");
  const [selectedReport, setSelectedReport] = useState("DRE");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [justificationText, setJustificationText] = useState("");
  const [newValue, setNewValue] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  // Mock data para demonstração
  const reportFields: ReportField[] = [
    {
      id: "1",
      name: "Receita Bruta",
      type: "number",
      currentValue: "1.250.000,00",
      required: true,
      category: "Receitas",
      validation: "Deve ser > 0"
    },
    {
      id: "2",
      name: "Custo dos Produtos Vendidos",
      type: "number",
      currentValue: "750.000,00",
      required: true,
      category: "Custos"
    },
    {
      id: "3",
      name: "Lucro Bruto",
      type: "formula",
      currentValue: "500.000,00",
      required: true,
      category: "Resultados",
      validation: "Receita Bruta - CPV"
    },
    {
      id: "4",
      name: "Margem Bruta (%)",
      type: "percentage",
      currentValue: "40,0%",
      required: true,
      category: "Indicadores"
    }
  ];

  const recentEdits: FieldEdit[] = [
    {
      id: "1",
      fieldName: "Receita Bruta",
      reportType: "DRE",
      oldValue: "1.200.000,00",
      newValue: "1.250.000,00",
      justification: "Ajuste conforme revisão de contratos de venda do 4º trimestre",
      attachments: ["contrato_revisao_q4.pdf"],
      status: "approved",
      aiRisk: "low",
      timestamp: "2024-01-15 14:30",
      user: "Ana Silva",
      aiSuggestion: "Alteração consistente com histórico de ajustes trimestrais"
    },
    {
      id: "2",
      fieldName: "Provisão para Devedores Duvidosos",
      reportType: "Balanço",
      oldValue: "25.000,00",
      newValue: "35.000,00",
      justification: "Aumento da provisão devido à análise de aging de recebíveis",
      attachments: ["aging_report_jan2024.xlsx", "analise_credito.pdf"],
      status: "pending",
      aiRisk: "medium",
      timestamp: "2024-01-15 16:45",
      user: "Carlos Santos",
      aiSuggestion: "Considere revisar critérios de provisão - aumento de 40% pode indicar deterioração da carteira"
    }
  ];

  const filteredFields = reportFields.filter(field => {
    const matchesSearch = field.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || field.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEditField = (fieldId: string) => {
    const field = reportFields.find(f => f.id === fieldId);
    if (field) {
      setEditingField(fieldId);
      setNewValue(field.currentValue);
      setJustificationText("");
      setAttachments([]);
    }
  };

  const handleSaveEdit = () => {
    if (!justificationText.trim()) {
      toast({
        title: "Justificativa obrigatória",
        description: "Por favor, forneça uma justificativa para a alteração.",
        variant: "destructive"
      });
      return;
    }

    // Simular salvamento
    toast({
      title: "Alteração salva",
      description: "A alteração foi registrada e enviada para aprovação.",
    });

    setEditingField(null);
    setJustificationText("");
    setNewValue("");
    setAttachments([]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case 'formula': return '∑';
      case 'percentage': return '%';
      case 'number': return '#';
      default: return 'T';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex-1 p-6 bg-gradient-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edição Estruturada</h1>
          <p className="text-muted-foreground text-lg mt-1">
            Edite campos dos relatórios com justificativas obrigatórias
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg">
            <History className="h-5 w-5 mr-2" />
            Histórico
          </Button>
          <Button size="lg">
            <Save className="h-5 w-5 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Edit3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">Campos Editáveis</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Pendentes Aprovação</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">18</p>
                <p className="text-sm text-muted-foreground">Aprovadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Sugestões IA</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo Principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="editor" className="text-base py-3">
            <Edit3 className="h-4 w-4 mr-2" />
            Editor de Campos
          </TabsTrigger>
          <TabsTrigger value="history" className="text-base py-3">
            <History className="h-4 w-4 mr-2" />
            Histórico de Edições
          </TabsTrigger>
          <TabsTrigger value="ai-insights" className="text-base py-3">
            <Brain className="h-4 w-4 mr-2" />
            Insights IA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-base font-medium">Relatório</Label>
                  <Select value={selectedReport} onValueChange={setSelectedReport}>
                    <SelectTrigger className="h-12 text-base mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRE">DRE</SelectItem>
                      <SelectItem value="Balanço">Balanço Patrimonial</SelectItem>
                      <SelectItem value="DFC">DFC</SelectItem>
                      <SelectItem value="DMPL">DMPL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-base font-medium">Buscar Campo</Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Digite o nome do campo..."
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
                      <SelectItem value="Receitas">Receitas</SelectItem>
                      <SelectItem value="Custos">Custos</SelectItem>
                      <SelectItem value="Resultados">Resultados</SelectItem>
                      <SelectItem value="Indicadores">Indicadores</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Campos */}
          <div className="grid gap-4">
            {filteredFields.map((field) => (
              <Card key={field.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center font-mono font-bold text-primary">
                        {getFieldTypeIcon(field.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{field.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{field.category}</Badge>
                          <Badge variant="outline">{field.type}</Badge>
                          {field.required && (
                            <Badge variant="destructive">Obrigatório</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-mono text-lg font-semibold">{field.currentValue}</p>
                        {field.validation && (
                          <p className="text-sm text-muted-foreground">{field.validation}</p>
                        )}
                      </div>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="lg"
                            onClick={() => handleEditField(field.id)}
                          >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-xl">Editar Campo: {field.name}</DialogTitle>
                            <DialogDescription className="text-base">
                              Faça as alterações necessárias e forneça uma justificativa detalhada.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-6 py-4">
                            <div>
                              <Label className="text-base font-medium">Valor Atual</Label>
                              <Input 
                                value={field.currentValue} 
                                disabled 
                                className="h-12 text-base mt-2 bg-muted"
                              />
                            </div>
                            
                            <div>
                              <Label className="text-base font-medium">Novo Valor *</Label>
                              <Input 
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                className="h-12 text-base mt-2"
                                placeholder="Digite o novo valor..."
                              />
                            </div>
                            
                            <div>
                              <Label className="text-base font-medium">Justificativa *</Label>
                              <Textarea 
                                value={justificationText}
                                onChange={(e) => setJustificationText(e.target.value)}
                                className="min-h-24 text-base mt-2"
                                placeholder="Descreva detalhadamente o motivo da alteração..."
                              />
                            </div>
                            
                            <div>
                              <Label className="text-base font-medium">Anexos (Opcional)</Label>
                              <div className="mt-2">
                                <input
                                  type="file"
                                  multiple
                                  onChange={handleFileUpload}
                                  className="hidden"
                                  id="file-upload"
                                />
                                <label htmlFor="file-upload">
                                  <Button variant="outline" className="h-12 text-base" asChild>
                                    <span>
                                      <Upload className="h-4 w-4 mr-2" />
                                      Adicionar Arquivos
                                    </span>
                                  </Button>
                                </label>
                                {attachments.length > 0 && (
                                  <div className="mt-3 space-y-2">
                                    {attachments.map((file, index) => (
                                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                                        <Paperclip className="h-4 w-4" />
                                        <span className="text-sm">{file.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <Alert>
                              <Brain className="h-4 w-4" />
                              <AlertDescription className="text-base">
                                <strong>Sugestão da IA:</strong> Esta alteração parece consistente com o padrão histórico. 
                                Recomenda-se verificar se há impacto em campos relacionados.
                              </AlertDescription>
                            </Alert>
                            
                            <div className="flex gap-3 pt-4">
                              <Button onClick={handleSaveEdit} size="lg" className="flex-1">
                                <Save className="h-4 w-4 mr-2" />
                                Salvar Alteração
                              </Button>
                              <Button variant="outline" size="lg">
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Histórico de Edições</CardTitle>
              <CardDescription className="text-base">
                Visualize todas as alterações realizadas nos campos dos relatórios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEdits.map((edit) => (
                  <div key={edit.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-lg">{edit.fieldName}</h4>
                        <p className="text-muted-foreground">{edit.reportType} • {edit.user} • {edit.timestamp}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRiskColor(edit.aiRisk)}>
                          Risco {edit.aiRisk === 'low' ? 'Baixo' : edit.aiRisk === 'medium' ? 'Médio' : 'Alto'}
                        </Badge>
                        <Badge className={getStatusColor(edit.status)}>
                          {edit.status === 'approved' ? 'Aprovado' : edit.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Valor Anterior:</p>
                        <p className="font-mono bg-red-50 p-2 rounded">{edit.oldValue}</p>
                      </div>
                      <div>
                        <p className="font-medium">Novo Valor:</p>
                        <p className="font-mono bg-green-50 p-2 rounded">{edit.newValue}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="font-medium text-sm mb-2">Justificativa:</p>
                      <p className="text-sm bg-muted p-3 rounded">{edit.justification}</p>
                    </div>
                    
                    {edit.aiSuggestion && (
                      <Alert>
                        <Brain className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Análise da IA:</strong> {edit.aiSuggestion}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {edit.attachments.length > 0 && (
                      <div>
                        <p className="font-medium text-sm mb-2">Anexos:</p>
                        <div className="flex gap-2">
                          {edit.attachments.map((attachment, index) => (
                            <Badge key={index} variant="outline" className="gap-1">
                              <Paperclip className="h-3 w-3" />
                              {attachment}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Insights e Recomendações da IA
                </CardTitle>
                <CardDescription className="text-base">
                  Análises automáticas baseadas nos padrões de edição e dados históricos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-base">
                    <strong>Atenção:</strong> Detectado aumento de 15% nas provisões para devedores duvidosos. 
                    Recomenda-se revisar critérios de análise de crédito.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-base">
                    <strong>Padrão Normal:</strong> As alterações em receitas estão dentro do padrão sazonal esperado 
                    para o período.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <Brain className="h-4 w-4" />
                  <AlertDescription className="text-base">
                    <strong>Sugestão:</strong> Considere automatizar o cálculo de alguns indicadores para reduzir 
                    erros manuais e agilizar o processo.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};