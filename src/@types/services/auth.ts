export interface UserDetails {
  name: string;
  email: string;
  password: string;
  studentId: string;
}

export interface AuthTokens {
  refreshToken: string;
  accessToken: string;
}
