import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { studentService } from '../services/Students';
import './student_main.css';

// Suggestion: Move these to a separate 'constants.js' file later
const UNIVERSITIES = ["Harvard University", "MIT", "Stanford University", "University of Toronto", "Oxford"];
const COUNTRIES = ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "Other"];
const LANGUAGES = ["English", "Spanish", "Mandarin", "French", "Arabic", "German", "Other"];
const FACULTIES = ["Engineering", "Arts & Sciences", "Business", "Medicine", "Law"];
const MAJORS = ["Computer Science", "Mechanical Engineering", "Economics", "Biology", "Psychology"];

const StudentMain = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const [info, setInfo] = useState({
    student_id: state?.studentId || '',
    first_name: '',
    last_name: '',
    uni_name: '',
    faculty: '',
    department: '',
    major: '',
    dob: '',
    academic_year: 1,
    gpa: 0,
    disability: false,
    athletic_status: '',
    country_of_origin: '',
    country_of_residence: '',
    gender: '',
    primary_language: '',
    study_hours: 0
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

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

  // Helper to render select options
  const renderOptions = (list) => list.map(item => (
    <option key={item} value={item}>{item}</option>
  ));

  return (
    <div className="login-container">
      <div className="login-card profile-card">
        <h2>Complete Your Profile</h2>
        <p className="subtitle">Please provide your academic details to continue</p>
        
        <form onSubmit={handleCreate}>
          {/* Names */}
          <div className="form-grid">
            <div className="input-group">
              <label>First Name</label>
              <input type="text" name="first_name" value={info.first_name} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <input type="text" name="last_name" value={info.last_name} onChange={handleChange} required />
            </div>
          </div>

          {/* University and Gender Dropdowns */}
          <div className="form-grid">
            <div className="input-group">
              <label>University</label>
              <select name="uni_name" value={info.uni_name} onChange={handleChange} required>
                <option value="" disabled>Select University</option>
                {renderOptions(UNIVERSITIES)}
              </select>
            </div>
            <div className="input-group">
              <label>Gender</label>
              <select name="gender" value={info.gender} onChange={handleChange} required>
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Location Dropdowns */}
          <div className="form-grid">
            <div className="input-group">
              <label>Country of Origin</label>
              <select name="country_of_origin" value={info.country_of_origin} onChange={handleChange} required>
                <option value="" disabled>Select Country</option>
                {renderOptions(COUNTRIES)}
              </select>
            </div>
            <div className="input-group">
              <label>Country of Residence</label>
              <select name="country_of_residence" value={info.country_of_residence} onChange={handleChange} required>
                <option value="" disabled>Select Country</option>
                {renderOptions(COUNTRIES)}
              </select>
            </div>
          </div>

          {/* Language and Study Hours */}
          <div className="form-grid">
            <div className="input-group">
              <label>Primary Language</label>
              <select name="primary_language" value={info.primary_language} onChange={handleChange} required>
                <option value="" disabled>Select Language</option>
                {renderOptions(LANGUAGES)}
              </select>
            </div>
            <div className="input-group">
              <label>Study Hours / Week</label>
              <input type="number" name="study_hours" value={info.study_hours} onChange={handleChange} required />
            </div>
          </div>

          {/* Academic Info Dropdowns */}
          <div className="form-grid">
            <div className="input-group">
              <label>Faculty</label>
              <select name="faculty" value={info.faculty} onChange={handleChange} required>
                <option value="" disabled>Select Faculty</option>
                {renderOptions(FACULTIES)}
              </select>
            </div>
            <div className="input-group">
              <label>Major</label>
              <select name="major" value={info.major} onChange={handleChange} required>
                <option value="" disabled>Select Major</option>
                {renderOptions(MAJORS)}
              </select>
            </div>
          </div>

          {/* Final Details */}
          <div className="form-grid">
            <div className="input-group">
              <label>Date of Birth</label>
              <input type="date" name="dob" value={info.dob} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>GPA</label>
              <input type="number" name="gpa" step="0.01" value={info.gpa} onChange={handleChange} required />
            </div>
          </div>

          <div className="checkbox-group">
            <input type="checkbox" id="disability" name="disability" checked={info.disability} onChange={handleChange} />
            <label htmlFor="disability">I have a disability requiring accommodation</label>
          </div>

          <button type="submit" className="login-btn">Save & Continue</button>
        </form>
      </div>
    </div>
  );
};

export default StudentMain;