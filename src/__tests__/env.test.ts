import * as envalid from 'envalid';
import { ValidatorSpec } from 'envalid';
import {
  DefaultMaxTokens,
  DefaultModel,
  DefaultTemperature,
  getEnv
} from '../env';

jest.mock('envalid');
const cleanEnv = jest.spyOn(envalid, 'cleanEnv');
const str = jest
  .spyOn(envalid, 'str')
  .mockReturnValue('mocked' as unknown as ValidatorSpec<string>);
const num = jest
  .spyOn(envalid, 'num')
  .mockReturnValue(1 as unknown as ValidatorSpec<number>);

describe('getEnv', () => {
  it('parse options with default values', () => {
    getEnv();
    expect(cleanEnv).toBeCalledTimes(1);
    expect(cleanEnv).toBeCalledWith(process.env, {
      OPENAI_API_KEY: 'mocked',
      OPENAI_DEFAULT_MAX_TOKENS: 1,
      OPENAI_DEFAULT_MODEL: 'mocked',
      OPENAI_DEFAULT_TEMPERATURE: 1
    });
    expect(str).toHaveBeenNthCalledWith(1); // OPENAI_API_KEY
    expect(num).toHaveBeenNthCalledWith(1, { default: DefaultMaxTokens }); // OPENAI_DEFAULT_MAX_TOKENS
    expect(str).toHaveBeenNthCalledWith(2, { default: DefaultModel }); // OPENAI_DEFAULT_MODEL
    expect(num).toHaveBeenNthCalledWith(2, { default: DefaultTemperature }); // OPENAI_DEFAULT_TEMPERATURE
  });
});
