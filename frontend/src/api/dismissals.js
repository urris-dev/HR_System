import { refreshTokens } from './auth.js';

const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/dismissals`;

export const getDismissals = async (filters, filterableFields) => {
  const response = await fetch(`${API_URL}/dismissals-list`, {
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
      return await getDismissals(filters, filterableFields);
    }
    throw new Error(response.statusText);
  }

  return await response.json();
};

export const createDismissal = async (payload) => {
  const response = await fetch(`${API_URL}/create-dismissal`, {
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
      await createDismissal(payload);
      return;
    }
    throw new Error((await response.json()).detail);
  }
};

export const editDismissal = async (payload, changedFields) => {
  const response = await fetch(`${API_URL}/edit-dismissal`, {
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
      await editDismissal(payload, changedFields);
      return;
    }
    throw new Error((await response.json()).detail);
  }
};

