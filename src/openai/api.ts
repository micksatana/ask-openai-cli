import { Configuration, OpenAIApi } from 'openai';
import { getEnv } from '../env';

let api: OpenAIApi;

export const getApi = () => {
  if (!api) {
    const config = new Configuration({
      apiKey: getEnv().OPENAI_API_KEY
    });
    api = new OpenAIApi(config);
  }

  return api;
};

