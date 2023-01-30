import { DefaultMaxTokens, DefaultModel, DefaultTemperature } from '../../env';
import { getApi } from '../api';
import { ask, parseDefaultAskOptions } from '../ask';
import { CreateCompletionResponse } from 'openai';

const api = {
  createCompletion: jest.fn()
};
jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  getApi: jest.fn(() => api)
}));
jest.mock('../../env');
jest.mock('../../axios/parse-error', () => ({ parseError: jest.fn((e) => e) }));

describe('parseDefaultAskOptions', () => {
  it('set defaults', () => {
    expect(parseDefaultAskOptions()).toEqual({
      model: DefaultModel,
      maxTokens: DefaultMaxTokens,
      temperature: DefaultTemperature
    });
  });
});

describe('ask', () => {
  const model = 'test-custom';
  const prompt = 'Hello';
  const temperature = 0.1;
  const maxTokens = 9;

  describe('when able to createCompletion', () => {
    const createCompletionResponse: CreateCompletionResponse = require('../__mocks__/data/create-completion.json');

    beforeAll(() => {
      api.createCompletion.mockResolvedValue({
        data: createCompletionResponse
      });
    });

    it('createCompletion called correctly', async () => {
      await expect(
        ask(prompt, {
          model,
          temperature,
          maxTokens
        })
      ).resolves.toEqual(createCompletionResponse);
      expect(getApi).toBeCalledTimes(1);
      expect(api.createCompletion).toBeCalledWith({
        model,
        prompt,
        temperature,
        max_tokens: maxTokens
      });
    });
  });

  describe('when failed to createCompletion', () => {
    const error = new Error('fake error');

    beforeAll(() => {
      api.createCompletion.mockRejectedValue(error);
    });

    it('createCompletion called correctly', async () => {
      await expect(
        ask(prompt, {
          model,
          temperature,
          maxTokens
        })
      ).rejects.toEqual(error);
    });
  });
});
