import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import About from "./pages/About";
import Dashboard from "./pages/dashboard";

import Header from "./components/Header";
import Sidebar from "./components/app-sidebar";
import ImageEditor from "./pages/image-editor";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        
        <div 
          className={`fixed top-0 right-0 bottom-0 flex flex-col transition-all duration-300 ${
            isSidebarCollapsed ? 'left-16' : 'left-64'
          } lg:${isSidebarCollapsed ? 'left-16' : 'left-64'} left-0`}
        >
          <Header onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/image-editor" element={<ImageEditor />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
