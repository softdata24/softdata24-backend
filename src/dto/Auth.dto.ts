export interface AuthRegisterDto {
  username: string;
  fname: string;
  lname: string;
  email?: string;
  phone?: string;
  password?: string; // only for direct
}

export interface AuthLoginDto {
  usernameOrEmail: string;
  password: string;
}

export interface AuthOAuthDto {
  provider: "google" | "github";
  providerId: string;
  email?: string;
  username?: string;
  fname: string;
  lname: string;
}