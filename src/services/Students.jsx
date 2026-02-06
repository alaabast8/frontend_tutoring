const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const STUDENT_URL = `${API_BASE_URL}/students`;
const INFO_URL = `${API_BASE_URL}/student-info`; // This line was likely missing!ffdfdf

export const studentService = {
  // 1. Register a new account
  register: async (formData) => {
    const response = await fetch(`${STUDENT_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Registration failed");
    return data;
  },

  // 2. Login to account
  login: async (username, password) => {
    const params = new URLSearchParams({ username, password });
    const response = await fetch(`${STUDENT_URL}/login?${params.toString()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Login failed");
    return data; // This now contains {id, username, message}
  },

  // 3. Check if the profile exists in students_info table
  checkProfile: async (studentId) => {
    const response = await fetch(`${INFO_URL}/check/${studentId}`);
    if (!response.ok) throw new Error("Failed to check profile status");
    return await response.json(); // Returns { exists: true/false }
  },

  // 4. Create the detailed profile (called from student_main.jsx)
  createProfile: async (profileData) => {
    const response = await fetch(`${INFO_URL}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Failed to save profile");
    return data;
  },
  // 5. Get existing profile details (REQUIRED for Dashboard)
  getProfile: async (studentId) => {
    const response = await fetch(`${INFO_URL}/${studentId}`);
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || "Failed to fetch profile");
    }
    return await response.json();
  },

  // 6. Logout and clear data
  logout: () => {
    localStorage.removeItem('studentId');
    localStorage.removeItem('username');
    // If you use tokens, clear them here too
  },

    // Get predicted GPA for student
  getPredictedGPA: async (studentId) => {
    const id = studentId || localStorage.getItem('studentId');
    
    if (!id) {
      throw new Error('No student ID found');
    }
    
    const response = await fetch(`${API_BASE_URL}/ml/predict-gpa/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get GPA prediction');
    }
    
    return response.json();
  },

  // Change this in your studentService object
getDoctorsByDepartmentAndFaculty: async (faculty) => {
  // Use a template literal to inject the faculty variable correctly
  const response = await fetch(
    `${API_BASE_URL}/doctor-info/filter/?faculty=${encodeURIComponent(faculty)}`
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch doctors');
  }
  
  return response.json();
},
};