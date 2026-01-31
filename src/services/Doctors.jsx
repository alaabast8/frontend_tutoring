const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const DOCTOR_URL = `${API_BASE_URL}/doctors`;
const DOCTOR_INFO_URL = `${API_BASE_URL}/doctor-info`;

export const doctorService = {
  register: async (formData) => {
    const response = await fetch(`${DOCTOR_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
        contact: formData.contact || '',
        price: formData.price || 0 
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Doctor registration failed");
    return data;
  },

  login: async (username, password) => {
  // We remove URLSearchParams because the backend says loc: ["body"]
  const response = await fetch(`${DOCTOR_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Send as JSON body instead of URL parameters
    body: JSON.stringify({ 
      username: username, 
      password: password 
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Doctor login fvddfailed frgf");
  }

  return data;
},
checkProfile: async (doctorId) => {
  if (!doctorId) {
    throw new Error("CheckProfile failed: doctorId is undefined");
  }
  const response = await fetch(`${DOCTOR_INFO_URL}/check/${doctorId}`);
  const data = await response.json();
  if (!response.ok) throw new Error("Failed to check profile status");
  return data;
},
  createProfile: async (profileData) => {
    const response = await fetch(`${DOCTOR_INFO_URL}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Failed to create profile");
    return data;
  }
};