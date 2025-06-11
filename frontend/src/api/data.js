const API_URL = "http://localhost:8000/api";

export const getEmployees = async () => {
    const response = await fetch(`${API_URL}/users/users`, {
      method: 'GET',
      credentials: 'include',
    });
  
    if (!response.ok) {
      if (response.status == 401) {
        await refreshTokens();
        await getEmployees();
        return;
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
        await getFactories();
        return;
      }
      throw new Error(response.statusText);
    }
  
    return await response.json();
}
