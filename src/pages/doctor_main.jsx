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
          <label htmlFor="uni_name">University Name</label>
          <input 
            id="uni_name"
            type="text" 
            required 
            value={formData.uni_name}
            onChange={(e) => setFormData({...formData, uni_name: e.target.value})}
          />
        </div>
        <div className="input-group">
          <label htmlFor="faculty">Faculty</label>
          <input 
            id="faculty"
            type="text" 
            required 
            value={formData.faculty}
            onChange={(e) => setFormData({...formData, faculty: e.target.value})}
          />
        </div>
        <div className="input-group">
          <label htmlFor="department">Department</label>
          <input 
            id="department"
            type="text" 
            required 
            value={formData.department}
            onChange={(e) => setFormData({...formData, department: e.target.value})}
          />
        </div>
        <div className="input-group">
          <label htmlFor="start_teaching_year">Start Teaching Year</label>
          <input 
            id="start_teaching_year"
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