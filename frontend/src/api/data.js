import { refreshTokens } from './auth.js';

const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api`;

export const getEmployees = async () => {
    const response = await fetch(`${API_URL}/users/users`, {
      method: 'GET',
      credentials: 'include',
    });
  
    if (!response.ok) {
      if (response.status == 401) {
        await refreshTokens();
        return await getEmployees();
      }
      throw new Error(response.statusText);
    }
  
    return await response.json();
}

export const getFactories = async () => {
    const response = await fetch(`${API_URL}/factories/factories-list`, {
      method: 'GET',
      credentials: 'include',
    });
  
    if (!response.ok) {
      if (response.status == 401) {
        await refreshTokens();
        return await getFactories();
      }
      throw new Error(response.statusText);
    }
  
    return await response.json();
}
