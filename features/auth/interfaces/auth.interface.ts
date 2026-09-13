export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface AuthTokens {
  authToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: {
    id: number;
    email: string;
    username: string;
    role: string;
  };
}
