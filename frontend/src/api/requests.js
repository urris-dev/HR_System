import { refreshTokens } from './auth.js';

const API_URL = 'http://localhost:8000/api/requests';

export const getRequests = async () => {
  const response = await fetch(`${API_URL}/requests-list`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    if (response.status == 401) {
      await refreshTokens();
      await getRequests();
      return;
    }
    throw new Error(response.statusText);
  }

  return await response.json();
}
