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
    contact: '',
    price: 0
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.name === 'price' ? parseFloat(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const service = role === 'student' ? studentService : doctorService;

      if (isRegistering) {
        // Register logic
        await service.register(formData); 
        alert(`Account created successfully! You can now login.`);
        setIsRegistering(false); // Switch back to login viewmm
      } else {
        // Login logic
        const data = await service.login(formData.username, formData.password);
        const actualId = data.id || data.doctor_id || (data.data && data.data.id);

        if (!actualId) {
          throw new Error("Login successful, but no ID was returned.");
        }

        localStorage.setItem('studentId', actualId);
        localStorage.setItem('username', formData.username);

        const profileStatus = await service.checkProfile(actualId);

        if (profileStatus.exists) {
          navigate(role === 'student' ? '/dashboard' : '/doctor-dashboard');
        } else {
          const path = role === 'student' ? '/student-main' : '/doctor-main';
          const stateKey = role === 'student' ? 'studentId' : 'doctorId';
          navigate(path, { state: { [stateKey]: actualId } });
        }
      }
    } catch (err) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isRegistering ? `Register as ${role.toUpperCase()}` : 'Login to Portal'}</h2>
        
        <div className="role-selector">
          <button className={role === 'student' ? 'active' : ''} onClick={() => setRole('student')}>Student</button>
          <button className={role === 'doctor' ? 'active' : ''} onClick={() => setRole('doctor')}>Doctor</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email is only for Student Registration */}
          {isRegistering && role === 'student' && (
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
          )}

          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input id="username" type="text" name="username" value={formData.username} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          {/* Doctor specific registration fields */}
          {isRegistering && role === 'doctor' && (
            <>
              <div className="input-group">
                <label htmlFor="contact">Contact Number</label>
                <input id="contact" type="text" name="contact" value={formData.contact} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label htmlFor="price">Consultation Price</label>
                <input id="price" type="number" name="price" value={formData.price} onChange={handleChange} required />
              </div>
            </>
          )}

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Processing...' : (isRegistering ? 'Create Account' : 'Login')}
          </button>
        </form>

        <div className="toggle-auth">
          <p>
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}
            <button type="button" className="link-btn" onClick={() => setIsRegistering(!isRegistering)}>
              {isRegistering ? 'Login here' : 'Register here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;