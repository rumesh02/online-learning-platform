// Decode JWT token without verification (for client-side only)
// Note: This is only for reading data. Backend should always verify and authorize.
export const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Get user role from token
export const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  const decoded = decodeToken(token);
  return decoded?.role || null;
};

// Get user ID from token
export const getUserId = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  const decoded = decodeToken(token);
  return decoded?.id || null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  const decoded = decodeToken(token);
  if (!decoded) return false;
  
  // Check if token is expired
  const currentTime = Date.now() / 1000;
  if (decoded.exp && decoded.exp < currentTime) {
    localStorage.removeItem('token');
    return false;
  }
  
  return true;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
};
