interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

type UserUpdate = Partial<User>; //all optional
type PublicUser = Pick<User, 'id' | 'name' | 'role'>; //Select fields to pick and send to client
type UserWithoutPassword = Omit<User, 'password'>; //exclude fields
type ImmutableUser = Readonly<User>; //nothing can change
type UserMap = Record<string, User>;

//type CreateUserDto = Omit<User, 'name', 'email'>;
