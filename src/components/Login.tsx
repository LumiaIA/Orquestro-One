import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const Login = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Usuários demo para diferentes níveis de acesso
  const demoUsers = {
    "admin": { 
      password: "admin123", 
      name: "Maria Silva", 
      role: "Administrador", 
      permissions: ["all"] 
    },
    "gestor": { 
      password: "gestor123", 
      name: "João Santos", 
      role: "Gestor Financeiro", 
      permissions: ["view", "edit", "approve"] 
    },
    "analista": { 
      password: "analista123", 
      name: "Ana Costa", 
      role: "Analista Contábil", 
      permissions: ["view", "edit"] 
    },
    "auditor": { 
      password: "auditor123", 
      name: "Carlos Oliveira", 
      role: "Auditor", 
      permissions: ["view", "audit"] 
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simula autenticação
    setTimeout(() => {
      const user = demoUsers[credentials.username as keyof typeof demoUsers];
      
      if (user && user.password === credentials.password) {
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo(a), ${user.name}`,
        });
        login({
          name: user.name,
          role: user.role,
          permissions: user.permissions
        });
      } else {
        toast({
          title: "Erro de autenticação",
          description: "Usuário ou senha incorretos",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-background p-4">
      <Card className="w-full max-w-md bg-card shadow-card border-0">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl text-foreground">Orquestro One</CardTitle>
            <CardDescription className="text-lg mt-2">
              Sistema de Demonstrações Financeiras
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Alert className="border-primary/20 bg-primary/5">
            <Shield className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              <strong>Usuários Demo:</strong><br />
              admin/admin123 • gestor/gestor123<br />
              analista/analista123 • auditor/auditor123
            </AlertDescription>
          </Alert>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-base font-medium">
                Usuário
              </Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                className="h-12 text-base"
                placeholder="Digite seu usuário"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base font-medium">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="h-12 text-base pr-12"
                  placeholder="Digite sua senha"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 text-base bg-gradient-primary"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar no Sistema"}
            </Button>
          </form>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Sistema seguro com autenticação blockchain</p>
            <p className="mt-1">Todas as ações são registradas para auditoria</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};