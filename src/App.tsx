"use client";

import type React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { createRoutes } from "./routes";

import { useAuthStore } from "./stores/authStore";
import { useSidebarStore } from "./stores/sidebarStore";
import Sidebar from "./components/app-sidebar";
import Header from "./components/header";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, initialize } = useAuthStore();

  useEffect(() => {
    // Initialize auth store when app starts
    initialize().catch(console.error);
  }, [initialize]);

  const AppLayout = ({ children }: { children: React.ReactNode }) => {
    const { isCollapsed } = useSidebarStore();

    return (
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div
          className={`fixed top-0 right-0 bottom-0 left-0 flex flex-col transition-all duration-300 ${
            isCollapsed
              ? "lg:left-12 xl:left-16"
              : "lg:left-64 xl:left-72 2xl:left-64"
          }`}
        >
          <Header onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="flex-1 overflow-auto">
            <div className="max-w-full mx-auto">{children}</div>
          </main>
        </div>
      </div>
    );
  };

  const routes = createRoutes(isAuthenticated, AppLayout);

  return (
    <Router>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
