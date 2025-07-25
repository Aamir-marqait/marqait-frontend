import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import About from "./pages/About";
import Dashboard from "./pages/dashboard";

import Header from "./components/Header";
import Sidebar from "./components/app-sidebar";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
