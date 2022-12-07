import logo from './logo.svg';
import './App.css';
import Login from './screens/Login';
import Register from './screens/Register';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
function App() {
  return (
    <div>

      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>

      </Router>
    </div>
  );
}

export default App;
