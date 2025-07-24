import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import About from "./pages/About";
import Dashboard from "./pages/dashboard";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen ">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
