import React, { useState } from 'react';
import { studentService } from '../services/Students';
import { doctorService } from '../services/Doctors';
import './login.css';

const Login = () => {
  const [role, setRole] = useState('student');
  const [isRegistering, setIsRegistering] = useState(false); // New state to toggle mode
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
      let data;
      const service = role === 'student' ? studentService : doctorService;

      if (isRegistering) {
        // Handle Registration
        data = await service.register(formData); 
        alert(`Account created successfully for ${data.username}! You can now login.`);
        setIsRegistering(false); // Switch back to login after successful registration
      } else {
        // Handle Login
        data = await service.login(formData.username, formData.password);
        alert(`Welcome back, ${data.username}!`);
        console.log("Login Success:", data);
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
          {/* Email field only shows during registration */}
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