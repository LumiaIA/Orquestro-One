import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Zap, 
  Shield, 
  Blocks,
  TrendingUp,
  Users,
  CheckCircle
} from "lucide-react";
import heroIllustration from "@/assets/hero-illustration.jpg";

export const WelcomeOverview = () => {
  const features = [
    {
      icon: Brain,
      title: "Inteligência Artificial",
      description: "IA em todos os módulos para acelerar decisões e garantir compliance"
    },
    {
      icon: Blocks,
      title: "Blockchain",
      description: "Registro imutável de ações com trilha de auditoria absoluta"
    },
    {
      icon: Zap,
      title: "Automação Total",
      description: "Elimina planilhas manuais e integra-se nativamente ao SAP"
    },
    {
      icon: Shield,
      title: "Compliance",
      description: "Monitoramento em tempo real com alertas preditivos"
    }
  ];

  const benefits = [
    "Elimina uso de planilhas manuais",
    "Integração nativa com SAP",
    "Trilha de auditoria imutável",
    "Usabilidade simples e escalável",
    "Rastreabilidade absoluta",
    "Tecnologia blockchain integrada"
  ];

  return (
    <div className="flex-1 p-6 bg-gradient-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">
          <div className="space-y-6">
            <Badge className="w-fit">
              <Blocks className="h-3 w-3 mr-2" />
              Enterprise Solution
            </Badge>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Orquestro One
              </h1>
              <h2 className="text-xl lg:text-2xl text-primary font-semibold mt-2">
                Automação Financeira Enterprise
              </h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Solução enterprise para automatizar, padronizar e controlar, de ponta a ponta, 
              toda a elaboração, revisão, aprovação e publicação das demonstrações financeiras 
              e notas explicativas.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-gradient-primary">
                <Zap className="h-4 w-4 mr-2" />
                Iniciar Automação
              </Button>
              <Button variant="outline" size="lg">
                <Brain className="h-4 w-4 mr-2" />
                Ver Demonstração
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <Card className="bg-gradient-subtle border-0 shadow-primary/10 p-8">
              <img 
                src={heroIllustration} 
                alt="Automação Financeira" 
                className="w-full h-auto rounded-lg"
              />
            </Card>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="bg-card shadow-card border-0 hover:shadow-primary/10 transition-smooth">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Benefits Section */}
        <Card className="bg-card shadow-card border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">Principais Benefícios</CardTitle>
            <CardDescription>
              Transforme seus processos financeiros com tecnologia de ponta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-subtle">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-primary text-primary-foreground border-0 shadow-primary">
            <CardContent className="text-center p-6">
              <div className="text-3xl font-bold">10</div>
              <div className="text-sm opacity-90">Módulos Integrados</div>
            </CardContent>
          </Card>
          <Card className="bg-card shadow-card border-0">
            <CardContent className="text-center p-6">
              <div className="text-3xl font-bold text-foreground">99.9%</div>
              <div className="text-sm text-muted-foreground">Disponibilidade</div>
            </CardContent>
          </Card>
          <Card className="bg-card shadow-card border-0">
            <CardContent className="text-center p-6">
              <div className="text-3xl font-bold text-foreground">24/7</div>
              <div className="text-sm text-muted-foreground">Monitoramento</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};