const API_URL = 'http://localhost:8000/api/users';

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: "include",
    body: JSON.stringify({
      email: email,
      password: password
    }),
  });

  return response;
};

export const refreshTokens = async () => {
  const response = await fetch(`${API_URL}/refresh`, {
    method: 'POST',
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status == 401) {
      localStorage.clear();
      throw new Error('Unauthorized');
    }
  } 
}