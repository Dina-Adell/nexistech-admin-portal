/** Credentials submitted from the sign-in form. */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

/** Session returned by the identity API once credentials are accepted. */
export interface AuthSession {
  token: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    displayName: string;
    role: 'owner' | 'admin' | 'operator';
  };
}
