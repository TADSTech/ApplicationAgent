// frontend/src/services/auth.ts

export const authProvider = {
  async loginWithFirebaseToken(token: string): Promise<any> {
    // Authenticate with the backend using Firebase JWT
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Authentication failed');
    return response.json();
  },

  logout(): void {
    localStorage.removeItem('user_token');
  }
};
export default authProvider;
