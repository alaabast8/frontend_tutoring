import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import StudentMain from './pages/student_main'; 
import DoctorMain from './pages/doctor_main'; // 1. Import your DoctorMain
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          
          {/* Student Routes */}
          <Route path="/student-main" element={<StudentMain />} />
          <Route path="/dashboard" element={<div><h1>Student Dashboard Content</h1></div>} />
          
          {/* Doctor Routes */}
          <Route path="/doctor-main" element={<DoctorMain />} /> {/* 2. Add this */}
          <Route path="/doctor-dashboard" element={<div><h1>Doctor Dashboard Content</h1></div>} /> {/* 3. Add this */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;