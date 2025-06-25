import { refreshTokens } from './auth.js';

const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/requests`;

export const getRequests = async (filters, filterableFields) => {
  const response = await fetch(`${API_URL}/requests-list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      ...filters,
      filterable_fields: new Array(...filterableFields)
    })
  });

  if (!response.ok) {
    if (response.status == 401) {
      await refreshTokens();
      return await getRequests(filters, filterableFields);
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
      changed_fields: new Array(...changedFields)
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
