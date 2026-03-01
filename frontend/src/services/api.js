const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const apiCall = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `API Error: ${response.status}`);
  }

  return response.json();
};

export const registerUser = (name) => {
  return apiCall('/lobby/register', 'POST', { name });
};

export const unregisterUser = (uuid) => {
  return apiCall('/lobby/unregister', 'DELETE', { uuid });
};

export const getBots = () => {
  return apiCall('/lobby/bots', 'GET');
};

export const createRequest = (from, message) => {
  return apiCall('/lobby/requests', 'POST', { from, message });
};

export const getRequests = (status = null) => {
  const endpoint = status ? `/lobby/requests?status=${status}` : '/lobby/requests';
  return apiCall(endpoint, 'GET');
};

export const getOpenRequests = () => {
  return apiCall('/lobby/requests?status=open', 'GET');
};

export const getClosedRequests = () => {
  return apiCall('/lobby/requests?status=closed', 'GET');
};

export const getAllRequests = () => {
  return apiCall('/lobby/requests?status=all', 'GET');
};

export const createReply = (requestId, from, message) => {
  return apiCall(`/lobby/requests/${requestId}/replies`, 'POST', { from, message });
};

export const getReplies = (requestId) => {
  return apiCall(`/lobby/requests/${requestId}/replies`, 'GET');
};

export const healthCheck = () => {
  return apiCall('/health', 'GET');
};