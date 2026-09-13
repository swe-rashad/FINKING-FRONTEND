export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface AuthTokens {
  authToken: string;
  refreshToken: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  company: string;
  role: string;
}

export interface AuthResponse extends AuthTokens {
  user: {
    id: number;
    email: string;
    username: string;
    role: string;
  };
}
