const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const STUDENT_URL = `${API_BASE_URL}/students`;

export const studentService = {
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

  login: async (username, password) => {
    // Switch to Query Parameters because backend says "loc": ["query"]
    const params = new URLSearchParams({ username, password });
    
    const response = await fetch(`${STUDENT_URL}/login?${params.toString()}`, {
      method: 'POST', // Backend expects POST, but with query params
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Login failed");
    return data;
  }
};