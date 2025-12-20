import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage"; 
import ConfirmacaoEmail from "./pages/CofirmacaoEmailPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <Router>
      <Routes>
    
        <Route path="/" element={<Login />} />
        
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/confirmacaoEmail" element={<ConfirmacaoEmail />} />
      </Routes>
    </Router>
  );
}

export default App;