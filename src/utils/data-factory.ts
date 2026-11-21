import type { UserRegistrationData } from '../types/user';

const firstNames = ['Alex', 'Jordan', 'Taylor', 'Sam', 'David', 'Kevin', 'Chris', 'Pat', 'Jamie', 'Morgan'];
const lastNames = ['Walker', 'Parker', 'Reed', 'Morgan', 'Bailey', 'Carter', 'Brooks', 'Gray', 'Hughes', 'Foster'];
const genders: UserRegistrationData['gender'][] = ['male', 'female'];

const pickRandom = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

const createFiveDigitSuffix = (): string => {
  return Math.floor(10000 + Math.random() * 900000).toString();
};

export const createRandomUser = (): UserRegistrationData => {
  const firstName = pickRandom(firstNames);
  const lastName = pickRandom(lastNames);
  const uniqueSuffix = createFiveDigitSuffix();

  return {
    gender: pickRandom(genders),
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${uniqueSuffix}@example.com`,
    password: 'P@ssword12345',
  };
};
