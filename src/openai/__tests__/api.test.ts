import * as OpenAI from 'openai';
import { getEnv } from '../../env';
import { getApi } from '../api';

jest.mock('openai');
jest.mock('../../env');

const Configuration = jest.spyOn(OpenAI, 'Configuration');

describe('getApi', () => {
  it('set correct apiKey', () => {
    expect(getApi()).toBeDefined();
    expect(getEnv).toBeCalledTimes(2);
    expect(Configuration).toBeCalledWith({ apiKey: 'fakeOpenAIAPIKey' });
  });
});
