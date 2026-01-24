import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import StudentMain from './pages/student_main'; // Make sure this file exists
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* This is the starting page */}
          <Route path="/" element={<Login />} />
          
          {/* This is where they go if the profile is missing */}
          <Route path="/student-main" element={<StudentMain />} />
          
          {/* This is where they go if the login + profile are successful */}
          <Route path="/dashboard" element={<div><h1>Dashboard Content</h1></div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;