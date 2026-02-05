import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../services/Students';
import './main_dashboard.css';

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [gpaData, setGpaData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingGPA, setLoadingGPA] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const studentId = localStorage.getItem('studentId');
      if (!studentId) {
        navigate('/');
        return;
      }

      const profile = await studentService.getProfile(studentId);
      setStudentData(profile);

      // Check if faculty exists specifically
      if (profile && profile.faculty) {
        setLoadingDoctors(true);
        try {
          // Pass ONLY the faculty as required by your backend
          const doctorsList = await studentService.getDoctorsByDepartmentAndFaculty(
            profile.faculty
          );
          setDoctors(doctorsList);
        } catch (err) {
          console.error("Doctor fetch error:", err.message);
          setDoctors([]);
        } finally {
          setLoadingDoctors(false);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardData();
}, [navigate]);

  const handlePredictGPA = async () => {
    setLoadingGPA(true);
    try {
      const studentId = localStorage.getItem('studentId');
      const prediction = await studentService.getPredictedGPA(studentId);
      setGpaData(prediction);
    } catch (err) {
      alert(err.message || 'Failed to predict GPA. Make sure ML service is running.');
    } finally {
      setLoadingGPA(false);
    }
  };

  const handleLogout = () => {
    studentService.logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader">Loading Dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Back to Login</button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>Student Portal</h2>
          <p className="username">{localStorage.getItem('username')}</p>
        </div>
        <ul className="nav-menu">
          <li className="active">
            <i className="icon">📊</i> Overview
          </li>
          <li>
            <i className="icon">📚</i> My Courses
          </li>
          <li>
            <i className="icon">📈</i> Grades
          </li>
          <li>
            <i className="icon">👥</i> Professors
          </li>
          <li onClick={handleLogout} className="logout">
            <i className="icon">🚪</i> Logout
          </li>
        </ul>
      </nav>

      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>Welcome back, {studentData?.first_name || 'Student'}!</h1>
          <p className="subtitle">Here's your academic overview</p>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎓</div>
            <div className="stat-info">
              <h3>Major</h3>
              <p className="stat-value">{studentData?.major || 'N/A'}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3>Academic Year</h3>
              <p className="stat-value">Year {studentData?.academic_year || 'N/A'}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏫</div>
            <div className="stat-info">
              <h3>Faculty</h3>
              <p className="stat-value">{studentData?.faculty || 'N/A'}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-info">
              <h3>Study Hours/Week</h3>
              <p className="stat-value">{studentData?.study_hours || 0}</p>
            </div>
          </div>
        </section>

        {/* GPA Prediction Section */}
        <section className="gpa-section">
          <div className="section-header">
            <h2>GPA Prediction</h2>
            <button 
              className="predict-btn" 
              onClick={handlePredictGPA}
              disabled={loadingGPA}
            >
              {loadingGPA ? 'Predicting...' : 'Predict My GPA'}
            </button>
          </div>
          
          {gpaData && (
            <div className="gpa-result">
              <div className="gpa-card">
                <h3>Predicted GPA</h3>
                <div className="gpa-value">
                  {gpaData.predicted_gpa ? gpaData.predicted_gpa.toFixed(2) : 'N/A'}
                </div>
                <p className="gpa-scale">out of 4.0</p>
              </div>
              <div className="gpa-details">
                <p>This prediction is based on your academic profile, study habits, and performance indicators.</p>
              </div>
            </div>
          )}
        </section>

        {/* Professors Section */}
        <section className="professors-section">
          <div className="section-header">
            <h2>Professors in Your Department</h2>
            <span className="count-badge">{doctors.length} professors</span>
          </div>

          {loadingDoctors ? (
            <div className="loading-doctors">Loading professors...</div>
          ) : doctors.length > 0 ? (
            <div className="doctors-grid">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="doctor-card">
                  <div className="doctor-header">
                    <div className="doctor-avatar">
                      {doctor.owner?.username?.charAt(0).toUpperCase() || 'D'}
                    </div>
                    <div className="doctor-info">
                      <h3>{doctor.owner?.username || 'Professor'}</h3>
                      <p className="doctor-dept">{doctor.department}</p>
                    </div>
                  </div>
                  
                  <div className="doctor-details">
                    <div className="detail-row">
                      <span className="label">Faculty:</span>
                      <span className="value">{doctor.faculty}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Teaching Since:</span>
                      <span className="value">{doctor.start_teaching_year}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">University:</span>
                      <span className="value">{doctor.uni_name}</span>
                    </div>
                    {doctor.owner?.price_per_hour && (
                      <div className="detail-row">
                        <span className="label">Rate:</span>
                        <span className="value price">${doctor.owner.price_per_hour}/hr</span>
                      </div>
                    )}
                    {doctor.owner?.contact && (
                      <div className="detail-row">
                        <span className="label">Contact:</span>
                        <span className="value">{doctor.owner.contact}</span>
                      </div>
                    )}
                  </div>
                  
                  <button className="contact-btn">Contact Professor</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-doctors">
              <p>No professors found in your department yet.</p>
            </div>
          )}
        </section>

        {/* Student Details Section */}
        <section className="details-section">
          <h2>Personal Information</h2>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Full Name:</span>
              <span className="detail-value">{studentData?.first_name} {studentData?.last_name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Date of Birth:</span>
              <span className="detail-value">{studentData?.dob}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Gender:</span>
              <span className="detail-value">{studentData?.gender}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Primary Language:</span>
              <span className="detail-value">{studentData?.primary_language}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Country of Origin:</span>
              <span className="detail-value">{studentData?.country_of_origin}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Country of Residence:</span>
              <span className="detail-value">{studentData?.country_of_residence}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Athletic Status:</span>
              <span className="detail-value">{studentData?.athletic_status || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Disability Accommodation:</span>
              <span className="detail-value">{studentData?.disability ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;