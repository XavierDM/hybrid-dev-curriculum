interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

type CreateUserDto = Omit<User, 'id' | 'CreatedAt'>;
type UpdateUserDto = Partial<Pick<User, 'name' | 'email' | 'password'>>;
type UserReadOnly = Readonly<User>;
type UserMap = Record<string, User>;
