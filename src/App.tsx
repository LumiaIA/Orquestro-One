import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Login } from "@/components/Login";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { WelcomeOverview } from "@/components/WelcomeOverview";
import { SAPIntegration } from "@/components/SAPIntegration";
import { TemplateManager } from "@/components/TemplateManager";
import { WorkflowManager } from "@/components/WorkflowManager";
import { AuditTrail } from "@/components/AuditTrail";
import { ComplianceMonitor } from "@/components/ComplianceMonitor";
import { AIInsightsDashboard } from "@/components/AIInsightsDashboard";
import { StructuredEditor } from "@/components/StructuredEditor";
import { APIManager } from "@/components/APIManager";
import { Toaster } from "@/components/ui/toaster";

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sap-integration" element={<SAPIntegration />} />
          <Route path="/templates" element={<TemplateManager />} />
          <Route path="/workflows" element={<WorkflowManager />} />
          <Route path="/audit-trail" element={<AuditTrail />} />
          <Route path="/compliance" element={<ComplianceMonitor />} />
          <Route path="/ai-insights" element={<AIInsightsDashboard />} />
          <Route path="/structured-editor" element={<StructuredEditor />} />
          <Route path="/api-manager" element={<APIManager />} />
          <Route path="*" element={
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-muted-foreground mb-4">404</h1>
                <p className="text-muted-foreground">Página não encontrada</p>
              </div>
            </div>
          } />
        </Routes>
      </main>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
