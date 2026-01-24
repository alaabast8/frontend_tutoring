import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../services/Students';
import { doctorService } from '../services/Doctors';
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('student'); // 'student' or 'doctor'
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '', 
    email: '',
    contact: '', // Added for doctor registration
    price: 0      // Added for doctor registration
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Switch service based on selected role
      const service = role === 'student' ? studentService : doctorService;

      if (isRegistering) {
        // --- REGISTRATION ---
        await service.register(formData); 
        alert(`Account created successfully! You can now login.`);
        setIsRegistering(false); 
      } else {
        // --- LOGIN ---
        const data = await service.login(formData.username, formData.password);
        
        // --- REDIRECTION LOGIC ---
        if (role === 'student') {
          const profileStatus = await studentService.checkProfile(data.id);
          if (profileStatus.exists) {
            navigate('/dashboard'); 
          } else {
            navigate('/student-main', { state: { studentId: data.id } });
          }
        } else {
  // Doctor login logic
  const data = await doctorService.login(formData.username, formData.password);
  
  // DEBUG: Check your console to see what the backend is actually sending
  console.log("Login Response Data:", data);

  // Fallback: Try data.id, then data.doctor_id, then data.data.id
  const actualId = data.id || data.doctor_id || (data.data && data.data.id);

  if (!actualId) {
    throw new Error("Login successful, but no Doctor ID was returned from the server.");
  }

  const profileStatus = await doctorService.checkProfile(actualId);

  if (profileStatus.exists) {
    navigate('/doctor-dashboard');
  } else {
    alert("Please complete your professional details.");
    navigate('/doctor-main', { state: { doctorId: actualId } });
  }
}
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isRegistering ? `Register as ${role.toUpperCase()}` : 'Login to Portal'}</h2>
        
        <div className="role-selector">
          <button 
            className={role === 'student' ? 'active' : ''} 
            onClick={() => { setRole('student'); setError(''); }}
          >
            Student
          </button>
          <button 
            className={role === 'doctor' ? 'active' : ''} 
            onClick={() => { setRole('doctor'); setError(''); }}
          >
            Doctor
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" name="email" 
                value={formData.email} onChange={handleChange} required 
              />
            </div>
          )}

          <div className="input-group">
            <label>Username</label>
            <input 
              type="text" name="username" 
              value={formData.username} onChange={handleChange} required 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" name="password" 
              value={formData.password} onChange={handleChange} required 
            />
          </div>

          {/* Optional: Add contact/price fields for Doctor registration if needed here */}

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Processing...' : (isRegistering ? 'Create Account' : 'Login')}
          </button>
        </form>

        <div className="toggle-mode">
          <p>
            {isRegistering ? "Already have an account?" : "Don't have an account?"}
            <button 
              type="button" 
              className="link-btn" 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
            >
              {isRegistering ? 'Login here' : 'Register now'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;