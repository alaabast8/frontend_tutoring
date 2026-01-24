import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../services/Students';
import { doctorService } from '../services/Doctors';
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
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
      const service = role === 'student' ? studentService : doctorService;

      if (isRegistering) {
        // --- REGISTRATION FLOW ---
        const data = await service.register(formData); 
        alert(`Account created successfully for ${data.username}! You can now login.`);
        setIsRegistering(false); 
      } else {
        // --- LOGIN FLOW ---
        const data = await service.login(formData.username, formData.password);
        
        if (role === 'student') {
          // 1. Check if the student has a profile in student_info
          // We use data.id which should come from your login response
          const profileStatus = await studentService.checkProfile(data.id);

          if (profileStatus.exists) {
            // 2a. Profile exists -> Go to Dashboard
            alert(`Welcome back, ${data.username}!`);
            navigate('/dashboard'); 
          } else {
            // 2b. Profile missing -> Go to student_main to fill data
            alert("Please complete your profile details to continue.");
            navigate('/student-main', { state: { studentId: data.id } });
          }
        } else {
          // Doctor login logic
          navigate('/doctor-dashboard');
        }
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isRegistering ? `Register as ${role}` : 'Login to Portal'}</h2>
        
        <div className="role-selector">
          <button 
            className={role === 'student' ? 'active' : ''} 
            onClick={() => setRole('student')}
          >
            Student
          </button>
          <button 
            className={role === 'doctor' ? 'active' : ''} 
            onClick={() => setRole('doctor')}
          >
            Doctor
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
          )}

          <div className="input-group">
            <label>Username</label>
            <input 
              type="text" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>

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