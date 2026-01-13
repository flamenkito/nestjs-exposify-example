export interface AuthUser<R extends string = string> {
  id: string;
  name: string;
  email: string;
  role: R;
}

export interface AuthResponse<R extends string = string> {
  accessToken: string;
  user: AuthUser<R>;
}

export interface JwtPayload<R extends string = string> {
  sub: string;
  email: string;
  name: string;
  role: R;
}
