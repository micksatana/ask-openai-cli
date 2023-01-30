import { AxiosError } from 'axios';

export const parseError = (e: unknown | AxiosError | Error): Error => {
  if ((e as AxiosError).isAxiosError) {
    const response = (e as AxiosError).response;

    return new Error(`${response?.statusText}: ${(e as Error).message}`);
  }

  return e as Error;
};
