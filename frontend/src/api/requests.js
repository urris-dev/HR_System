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

export const createRequest = async (payload) => {
  const response = await fetch(`${API_URL}/create-request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    if (response.status == 401) {
      await refreshTokens();
      await createRequest(payload);
      return;
    }
    throw new Error((await response.json()).detail);
  }
};

export const editRequest = async (payload, changedFields) => {
  const response = await fetch(`${API_URL}/edit-request`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      ...payload,
      changed_fields: changedFields
    }),
  });

  if (!response.ok) {
    if (response.status == 401) {
      await refreshTokens();
      await editRequest(payload, changedFields);
      return;
    }
    throw new Error((await response.json()).detail);
  }
};

export const getEmployees = async () => {
  const response = await fetch(`http://localhost:8000/api/users/users`, {
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
