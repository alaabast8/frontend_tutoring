import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doctorService } from '../services/Doctors';

const DoctorMain = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const doctorId = location.state?.doctorId;

  const [formData, setFormData] = useState({
    uni_name: '',
    faculty: '',
    department: '',
    start_teaching_year: new Date().getFullYear()
  });

  useEffect(() => {
    if (!doctorId) {
      alert("Session expired. Please login again.");
      navigate('/login');
    }
  }, [doctorId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await doctorService.createProfile({
        doctor_id: doctorId,
        ...formData,
        start_teaching_year: parseInt(formData.start_teaching_year)
      });
      alert("Profile completed successfully!");
      navigate('/doctor-dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="profile-setup-container">
      <h2>Complete Your Professional Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>University Name</label>
          <input 
            type="text" 
            required 
            value={formData.uni_name}
            onChange={(e) => setFormData({...formData, uni_name: e.target.value})}
          />
        </div>
        <div className="input-group">
          <label>Faculty</label>
          <input 
            type="text" 
            required 
            value={formData.faculty}
            onChange={(e) => setFormData({...formData, faculty: e.target.value})}
          />
        </div>
        <div className="input-group">
          <label>Department</label>
          <input 
            type="text" 
            required 
            value={formData.department}
            onChange={(e) => setFormData({...formData, department: e.target.value})}
          />
        </div>
        <div className="input-group">
          <label>Start Teaching Year</label>
          <input 
            type="number" 
            required 
            value={formData.start_teaching_year}
            onChange={(e) => setFormData({...formData, start_teaching_year: e.target.value})}
          />
        </div>
        <button type="submit" className="login-btn">Save Profile & Continue</button>
      </form>
    </div>
  );
};

export default DoctorMain;