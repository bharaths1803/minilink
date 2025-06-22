export interface Login {
  email: string;
  password: string;
}

export interface Signup extends Login {
  username: string;
  profilePic: string;
}

export interface User {
  username: string;
  profilePicUrl: string;
  email: string;
  id: string;
}

export interface Url {
  title: string;
  longUrl: string;
  customUrl?: string;
  qrCode: string;
  userId: string;
}
