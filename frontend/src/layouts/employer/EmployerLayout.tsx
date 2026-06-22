import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AiFloatingAssistant from "./components/AiFloatingAssistant";

const EmployerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex overflow-hidden">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        
        {/* Child Pages Content will render here */}
        <Outlet />
        
        {/* AI Floating Assistant */}
        <AiFloatingAssistant />
      </main>
    </div>
  );
};

export default EmployerLayout;
