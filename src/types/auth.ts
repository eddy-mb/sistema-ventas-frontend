export interface LoginResponse {
  status: string;
  message: string;
  data: Data;
}

export interface Data {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
  roles: string | string[];
  permissions: string[];
}

export interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
  is_active: boolean;
}
