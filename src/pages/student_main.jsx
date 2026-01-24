import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { studentService } from '../services/Students';
import './student_main.css'; // Import the new CSS file

const StudentMain = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const [info, setInfo] = useState({
    student_id: state?.studentId,
    first_name: '',
    last_name: '',
    uni_name: '',
    faculty: '',
    department: '',
    major: '',
    disability: false,
    gpa: 0,
    dob: '',
    academic_year: 1
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!info.student_id) {
      alert("Session expired. Please login again.");
      navigate('/');
      return;
    }

    try {
      await studentService.createProfile(info);
      alert("Profile completed successfully!");
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card profile-card">
        <h2>Complete Your Profile</h2>
        <p className="subtitle">Please provide your academic details to continue</p>
        
        <form onSubmit={handleCreate}>
          {/* Row 1: Names */}
          <div className="form-grid">
            <div className="input-group">
              <label>First Name</label>
              <input 
                type="text" 
                placeholder="John" 
                onChange={e => setInfo({...info, first_name: e.target.value})} 
                required 
              />
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <input 
                type="text" 
                placeholder="Doe" 
                onChange={e => setInfo({...info, last_name: e.target.value})} 
                required 
              />
            </div>
          </div>

          {/* Row 2: University & Faculty */}
          <div className="form-grid">
            <div className="input-group">
              <label>University Name</label>
              <input 
                type="text" 
                placeholder="State University" 
                onChange={e => setInfo({...info, uni_name: e.target.value})} 
                required 
              />
            </div>
            <div className="input-group">
              <label>Faculty</label>
              <input 
                type="text" 
                placeholder="Engineering & Tech" 
                onChange={e => setInfo({...info, faculty: e.target.value})} 
                required 
              />
            </div>
          </div>

          {/* Row 3: Department & Major */}
          <div className="form-grid">
            <div className="input-group">
              <label>Department</label>
              <input 
                type="text" 
                placeholder="Software Engineering" 
                onChange={e => setInfo({...info, department: e.target.value})} 
                required 
              />
            </div>
            <div className="input-group">
              <label>Major</label>
              <input 
                type="text" 
                placeholder="Computer Science" 
                onChange={e => setInfo({...info, major: e.target.value})} 
                required 
              />
            </div>
          </div>

          {/* Row 4: Academic Year & GPA */}
          <div className="form-grid">
            <div className="input-group">
              <label>Academic Year</label>
              <input 
                type="number" 
                min="1" 
                max="5" 
                value={info.academic_year} 
                onChange={e => setInfo({...info, academic_year: parseInt(e.target.value)})} 
                required 
              />
            </div>
            <div className="input-group">
              <label>GPA</label>
              <input 
                type="number" 
                step="0.01" 
                placeholder="4.0" 
                onChange={e => setInfo({...info, gpa: parseFloat(e.target.value)})} 
                required 
              />
            </div>
          </div>

          {/* Row 5: Date of Birth */}
          <div className="input-group">
            <label>Date of Birth</label>
            <input 
              type="date" 
              onChange={e => setInfo({...info, dob: e.target.value})} 
              required 
            />
          </div>

          {/* Row 6: Disability Checkbox */}
          <div className="checkbox-group">
            <input 
              type="checkbox" 
              id="disability" 
              onChange={e => setInfo({...info, disability: e.target.checked})} 
            />
            <label htmlFor="disability">I have a disability requiring accommodation</label>
          </div>

          <button type="submit" className="login-btn">Save & Continue</button>
        </form>
      </div>
    </div>
  );
};

export default StudentMain;