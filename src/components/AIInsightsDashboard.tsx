import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  Eye,
  Calendar,
  Users
} from "lucide-react";

interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'prediction' | 'anomaly' | 'optimization' | 'risk';
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: string;
  value?: string;
  trend?: 'up' | 'down' | 'stable';
  recommendations: string[];
  createdAt: string;
}

interface KPIMetric {
  id: string;
  name: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  target?: string;
  category: string;
  aiPrediction?: string;
}

const mockInsights: AIInsight[] = [
  {
    id: '1',
    title: 'Previsão de Fluxo de Caixa',
    description: 'IA prevê déficit de R$ 1.2M em março baseado em padrões históricos',
    type: 'prediction',
    confidence: 87,
    impact: 'high',
    category: 'Fluxo de Caixa',
    value: 'R$ -1.2M',
    trend: 'down',
    recommendations: [
      'Acelerar cobrança de clientes em atraso',
      'Renegociar prazos com fornecedores',
      'Considerar linha de crédito preventiva'
    ],
    createdAt: '2024-01-15T10:30:00'
  },
  {
    id: '2',
    title: 'Anomalia em Despesas Operacionais',
    description: 'Aumento atípico de 23% nas despesas administrativas detectado',
    type: 'anomaly',
    confidence: 92,
    impact: 'medium',
    category: 'Despesas',
    value: '+23%',
    trend: 'up',
    recommendations: [
      'Revisar contratos de serviços terceirizados',
      'Analisar variação de custos por centro de custo',
      'Verificar lançamentos manuais do período'
    ],
    createdAt: '2024-01-15T09:15:00'
  },
  {
    id: '3',
    title: 'Oportunidade de Otimização',
    description: 'IA identificou potencial economia de R$ 450K em custos de estoque',
    type: 'optimization',
    confidence: 78,
    impact: 'medium',
    category: 'Estoque',
    value: 'R$ 450K',
    trend: 'up',
    recommendations: [
      'Implementar modelo de estoque just-in-time',
      'Renegociar termos com fornecedores estratégicos',
      'Otimizar ciclo de reposição'
    ],
    createdAt: '2024-01-15T08:45:00'
  },
  {
    id: '4',
    title: 'Risco de Inadimplência',
    description: 'Modelo preditivo indica aumento de 15% no risco de inadimplência',
    type: 'risk',
    confidence: 85,
    impact: 'high',
    category: 'Crédito',
    value: '+15%',
    trend: 'up',
    recommendations: [
      'Revisar política de crédito',
      'Intensificar cobrança preventiva',
      'Avaliar garantias de clientes de risco'
    ],
    createdAt: '2024-01-15T07:20:00'
  }
];

const mockKPIs: KPIMetric[] = [
  {
    id: '1',
    name: 'Receita Líquida',
    value: 'R$ 45.2M',
    change: 8.5,
    trend: 'up',
    target: 'R$ 48M',
    category: 'Financeiro',
    aiPrediction: 'R$ 47.1M (próximo mês)'
  },
  {
    id: '2',
    name: 'EBITDA',
    value: 'R$ 12.8M',
    change: -2.3,
    trend: 'down',
    target: 'R$ 15M',
    category: 'Financeiro',
    aiPrediction: 'R$ 13.5M (próximo mês)'
  },
  {
    id: '3',
    name: 'Margem Líquida',
    value: '18.5%',
    change: 1.2,
    trend: 'up',
    target: '20%',
    category: 'Rentabilidade',
    aiPrediction: '19.1% (próximo mês)'
  },
  {
    id: '4',
    name: 'Prazo Médio Recebimento',
    value: '42 dias',
    change: -5.8,
    trend: 'up',
    target: '35 dias',
    category: 'Operacional',
    aiPrediction: '38 dias (próximo mês)'
  },
  {
    id: '5',
    name: 'Índice de Liquidez',
    value: '1.85',
    change: 0.15,
    trend: 'up',
    target: '2.0',
    category: 'Liquidez',
    aiPrediction: '1.92 (próximo mês)'
  },
  {
    id: '6',
    name: 'ROI',
    value: '15.2%',
    change: 2.1,
    trend: 'up',
    target: '18%',
    category: 'Rentabilidade',
    aiPrediction: '16.8% (próximo mês)'
  }
];

const getInsightTypeIcon = (type: string) => {
  switch (type) {
    case 'prediction': return <TrendingUp className="h-5 w-5" />;
    case 'anomaly': return <AlertTriangle className="h-5 w-5" />;
    case 'optimization': return <Target className="h-5 w-5" />;
    case 'risk': return <AlertTriangle className="h-5 w-5" />;
    default: return <Brain className="h-5 w-5" />;
  }
};

const getInsightTypeColor = (type: string) => {
  switch (type) {
    case 'prediction': return 'bg-blue-500 text-white';
    case 'anomaly': return 'bg-orange-500 text-white';
    case 'optimization': return 'bg-green-500 text-white';
    case 'risk': return 'bg-red-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'high': return 'text-red-600';
    case 'medium': return 'text-orange-600';
    case 'low': return 'text-green-600';
    default: return 'text-gray-600';
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
    case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
    case 'stable': return <Activity className="h-4 w-4 text-gray-500" />;
    default: return null;
  }
};

export const AIInsightsDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImpact, setSelectedImpact] = useState<string>('all');

  const filteredInsights = mockInsights.filter(insight => {
    const matchesCategory = selectedCategory === 'all' || insight.category === selectedCategory;
    const matchesImpact = selectedImpact === 'all' || insight.impact === selectedImpact;
    return matchesCategory && matchesImpact;
  });

  const highImpactInsights = mockInsights.filter(insight => insight.impact === 'high').length;
  const avgConfidence = Math.round(mockInsights.reduce((acc, insight) => acc + insight.confidence, 0) / mockInsights.length);
  const positiveKPIs = mockKPIs.filter(kpi => kpi.change > 0).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard de Insights IA</h1>
          <p className="text-muted-foreground mt-2">
            Análises preditivas e insights inteligentes para tomada de decisão
          </p>
        </div>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Insights Alto Impacto</p>
                <p className="text-2xl font-bold text-red-600">{highImpactInsights}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confiança Média IA</p>
                <p className="text-2xl font-bold text-blue-600">{avgConfidence}%</p>
              </div>
              <Brain className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">KPIs Positivos</p>
                <p className="text-2xl font-bold text-green-600">{positiveKPIs}/{mockKPIs.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Insights</p>
                <p className="text-2xl font-bold text-purple-600">{mockInsights.length}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="insights">Insights IA</TabsTrigger>
          <TabsTrigger value="kpis">KPIs e Métricas</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">Todas as Categorias</option>
                  <option value="Fluxo de Caixa">Fluxo de Caixa</option>
                  <option value="Despesas">Despesas</option>
                  <option value="Estoque">Estoque</option>
                  <option value="Crédito">Crédito</option>
                </select>
                <select
                  value={selectedImpact}
                  onChange={(e) => setSelectedImpact(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">Todos os Impactos</option>
                  <option value="high">Alto Impacto</option>
                  <option value="medium">Médio Impacto</option>
                  <option value="low">Baixo Impacto</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Insights List */}
          <div className="grid gap-4">
            {filteredInsights.map((insight) => (
              <Card key={insight.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getInsightTypeIcon(insight.type)}
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                        <Badge className={getInsightTypeColor(insight.type)}>
                          {insight.type.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className={getImpactColor(insight.impact)}>
                          {insight.impact.toUpperCase()}
                        </Badge>
                      </div>
                      <CardDescription>{insight.description}</CardDescription>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Brain className="h-4 w-4" />
                          Confiança: {insight.confidence}%
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(insight.createdAt).toLocaleString('pt-BR')}
                        </span>
                        {insight.value && (
                          <span className="flex items-center gap-1">
                            {getTrendIcon(insight.trend!)}
                            {insight.value}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Nível de Confiança</span>
                        <span className="text-sm font-bold">{insight.confidence}%</span>
                      </div>
                      <Progress value={insight.confidence} className="h-2" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Recomendações da IA:</h4>
                      <ul className="space-y-1">
                        {insight.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="default">
                        Implementar
                      </Button>
                      <Button size="sm" variant="outline">
                        Analisar
                      </Button>
                      <Button size="sm" variant="outline">
                        Agendar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="kpis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockKPIs.map((kpi) => (
              <Card key={kpi.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{kpi.name}</CardTitle>
                    {getTrendIcon(kpi.trend)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{kpi.value}</span>
                      <Badge variant={kpi.change > 0 ? 'default' : 'destructive'}>
                        {kpi.change > 0 ? '+' : ''}{kpi.change}%
                      </Badge>
                    </div>
                    {kpi.target && (
                      <div className="text-sm text-muted-foreground">
                        Meta: {kpi.target}
                      </div>
                    )}
                    {kpi.aiPrediction && (
                      <div className="text-sm">
                        <span className="flex items-center gap-1 text-blue-600">
                          <Brain className="h-3 w-3" />
                          Previsão IA: {kpi.aiPrediction}
                        </span>
                      </div>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {kpi.category}
                    </Badge>
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