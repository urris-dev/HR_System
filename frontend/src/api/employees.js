import { refreshTokens } from './auth.js';

const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/users`;

export const createEmployee = async (payload) => {
  const response = await fetch(`${API_URL}/create-user`, {
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
      await createEmployee(payload);
      return;
    }
    throw new Error((await response.json()).detail);
  }
};

export const editEmployee = async (payload, changedFields) => {
  const response = await fetch(`${API_URL}/edit-user`, {
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
      await editEmployee(payload, changedFields);
      return;
    }
    throw new Error((await response.json()).detail);
  }
};

export const getEmployees = async () => {
  const response = await fetch(`${API_URL}/users-list`, {
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
