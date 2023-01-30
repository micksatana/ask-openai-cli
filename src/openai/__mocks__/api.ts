import { OpenAIApi } from 'openai';

export const getApi = jest.fn(() => {
  const api = new OpenAIApi();

  jest.spyOn(api, 'createCompletion');

  return api;
});
