export type AuthUser = {
  _id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  phone?: string;
  dob?: string;
};

export type TUser = {
  _id: string;
  name: string;
  phone: string;
  image: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
};
