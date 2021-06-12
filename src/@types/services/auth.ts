export interface UserDetails {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthTokens {
  refreshToken: string;
  accessToken: string;
}
