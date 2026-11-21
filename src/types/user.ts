export type Gender = 'male' | 'female';

export type UserRegistrationData = {
  gender: Gender;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};
