import dotenv from 'dotenv';

dotenv.config();

const parseBoolean = (value: string | undefined, fallback = false): boolean => {
  if (value === undefined) {
    return fallback;
  }

  return value.trim().toLowerCase() === 'true';
};

const normalizeBaseUrl = (value: string | undefined): string => {
  const fallback = 'https://new.demowebshop.tricentis.com/';
  const candidate = value?.trim() || fallback;

  return candidate.endsWith('/') ? candidate : `${candidate}/`;
};

export const environment = {
  baseUrl: normalizeBaseUrl(process.env.BASE_URL),
  isCi: parseBoolean(process.env.CI),
  ignoreHttpsErrors: parseBoolean(process.env.IGNORE_HTTPS_ERRORS),
  runMutatingTests: parseBoolean(process.env.RUN_MUTATING_TESTS),
} as const;
