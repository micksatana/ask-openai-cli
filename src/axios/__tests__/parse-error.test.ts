import { AxiosError } from 'axios';
import { parseError } from '../parse-error';

describe('parseError', () => {
  it('parse AxiosError', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        statusText: ''
      }
    } as AxiosError;

    expect(
      // Simulate unknow as if throwing into catch block
      parseError(axiosError as unknown)
    ).toEqual(
      new Error(`${axiosError.response?.statusText}: ${axiosError.message}`)
    );
  });

  it('returns Error', () => {
    const error = new Error('generic error');

    expect(parseError(error)).toEqual(error);
  })
});
