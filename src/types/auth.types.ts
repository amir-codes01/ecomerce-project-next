export interface User {
  id: string;
  username: string;
  email: string;
}

export interface LoginResponse {
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    user: User;
  };
}
