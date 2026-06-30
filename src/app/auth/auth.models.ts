export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  token: string;
}

export interface IAuthSession {
  id: number;
  name: string;
  email: string;
  token: string;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}
