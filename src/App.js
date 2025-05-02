
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "./components/Dashboard"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
