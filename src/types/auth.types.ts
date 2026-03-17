export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    user: User;
  };
}
