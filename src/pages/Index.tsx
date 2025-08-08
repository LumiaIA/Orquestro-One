import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { WelcomeOverview } from "@/components/WelcomeOverview";

const Index = () => {
  const [activeView, setActiveView] = useState("overview");

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />;
      case "overview":
      default:
        return <WelcomeOverview />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-background">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      {renderContent()}
    </div>
  );
};

export default Index;
