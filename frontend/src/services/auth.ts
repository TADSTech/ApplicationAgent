// frontend/src/services/auth.ts
import { apiClient } from './api';

export const authProvider = {
  async loginWithFirebaseToken(token: string): Promise<any> {
    // Authenticate with the backend using Firebase JWT
    return apiClient.login(token);
  },

  logout(): void {
    localStorage.removeItem('user_token');
  }
};
export default authProvider;
