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
        {/* Desktop Sidebar */}
        <div className="hidden lg:block z-1 min-h-screen">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>

        <div className="flex-1 z-0 flex flex-col">
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
